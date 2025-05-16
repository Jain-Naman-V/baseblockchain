// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IAccessControl.sol";

/**
 * @title AccessControl
 * @dev Implements NFT-based permissions for medical record access
 * Each permission is represented as an NFT that can be granted/revoked
 */
contract AccessControl is IAccessControl, Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    
    // Access levels
    uint8 public constant READ_ACCESS = 1;
    uint8 public constant WRITE_ACCESS = 2;
    
    // Token ID counter
    Counters.Counter private _tokenIdCounter;
    
    // Struct to store access details
    struct AccessDetails {
        bool isAuthorized;
        uint256 expiryTime;
        uint8 accessLevel;
        uint256 tokenId;  // NFT token ID that represents this permission
    }
    
    // Mapping from patient to doctor to access details
    mapping(address => mapping(address => AccessDetails)) private patientDoctorAccess;
    
    // Mapping from patient to all authorized doctors
    mapping(address => address[]) private patientToDoctors;
    
    // Mapping from token ID to patient-doctor pair
    mapping(uint256 => bytes32) private tokenToPair;
    
    // Events
    event AccessGranted(address indexed patient, address indexed doctor, uint256 tokenId, uint256 expiryTime, uint8 accessLevel);
    event AccessRevoked(address indexed patient, address indexed doctor, uint256 tokenId);
    
    /**
     * @dev Constructor
     */
    constructor() Ownable(msg.sender) ERC721("MedicalAccessNFT", "MEDREC") {}
    
    /**
     * @dev Grant access to a doctor
     * @param _doctor Address of the doctor to grant access
     * @param _expiryTime Timestamp after which access expires
     * @param _accessLevel Access level (1 = read-only, 2 = read-write)
     */
    function grantAccess(address _doctor, uint256 _expiryTime, uint8 _accessLevel) external override {
        require(_doctor != address(0), "Invalid doctor address");
        require(_expiryTime > block.timestamp, "Expiry time must be in the future");
        require(_accessLevel == READ_ACCESS || _accessLevel == WRITE_ACCESS, "Invalid access level");
        
        // Check if doctor already has access
        AccessDetails storage access = patientDoctorAccess[msg.sender][_doctor];
        
        // If new access, add to the list of doctors
        if (!access.isAuthorized) {
            patientToDoctors[msg.sender].push(_doctor);
        } else {
            // Burn the old token if it exists
            if (access.tokenId > 0) {
                _burn(access.tokenId);
            }
        }
        
        // Mint a new access NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_doctor, tokenId);
        
        // Update token metadata (could include patient info, expiry, etc.)
        string memory tokenURI = string(abi.encodePacked(
            "ipfs://record-access/",
            _toString(msg.sender),
            "/",
            _toString(tokenId)
        ));
        _setTokenURI(tokenId, tokenURI);
        
        // Store token-to-patient-doctor mapping
        tokenToPair[tokenId] = keccak256(abi.encodePacked(msg.sender, _doctor));
        
        // Update access details
        access.isAuthorized = true;
        access.expiryTime = _expiryTime;
        access.accessLevel = _accessLevel;
        access.tokenId = tokenId;
        
        emit AccessGranted(msg.sender, _doctor, tokenId, _expiryTime, _accessLevel);
    }
    
    /**
     * @dev Revoke access from a doctor
     * @param _doctor Address of the doctor to revoke access from
     */
    function revokeAccess(address _doctor) external override {
        require(_doctor != address(0), "Invalid doctor address");
        
        AccessDetails storage access = patientDoctorAccess[msg.sender][_doctor];
        require(access.isAuthorized, "No active access to revoke");
        
        // Burn the NFT
        if (access.tokenId > 0) {
            _burn(access.tokenId);
        }
        
        // Remove from doctor list (by setting to address 0, we'll filter these out when querying)
        address[] storage doctors = patientToDoctors[msg.sender];
        for (uint256 i = 0; i < doctors.length; i++) {
            if (doctors[i] == _doctor) {
                doctors[i] = address(0);
                break;
            }
        }
        
        // Update access details
        access.isAuthorized = false;
        access.expiryTime = 0;
        access.accessLevel = 0;
        access.tokenId = 0;
        
        emit AccessRevoked(msg.sender, _doctor, access.tokenId);
    }
    
    /**
     * @dev Check if a doctor has access to a patient's records
     * @param _patient Address of the patient
     * @param _doctor Address of the doctor
     * @return True if the doctor has active access, false otherwise
     */
    function checkAccess(address _patient, address _doctor) external view override returns (bool) {
        AccessDetails memory access = patientDoctorAccess[_patient][_doctor];
        
        // Check if authorized and not expired
        return access.isAuthorized && access.expiryTime > block.timestamp;
    }
    
    /**
     * @dev Get the detailed access information for a doctor to a patient
     * @param _patient Address of the patient
     * @param _doctor Address of the doctor
     */
    function getAccessDetails(address _patient, address _doctor) external view override returns (
        bool isAuthorized,
        uint256 expiryTime,
        uint8 accessLevel
    ) {
        AccessDetails memory access = patientDoctorAccess[_patient][_doctor];
        
        // Check if access has expired
        if (access.expiryTime <= block.timestamp) {
            return (false, access.expiryTime, access.accessLevel);
        }
        
        return (access.isAuthorized, access.expiryTime, access.accessLevel);
    }
    
    /**
     * @dev Get all doctors with access to a patient's records
     * @param _patient Address of the patient
     * @return Array of doctor addresses with access
     */
    function getAllAuthorizedDoctors(address _patient) external view override returns (address[] memory) {
        address[] memory doctors = patientToDoctors[_patient];
        uint256 count = 0;
        
        // First pass: count valid doctors
        for (uint256 i = 0; i < doctors.length; i++) {
            if (doctors[i] != address(0) && 
                patientDoctorAccess[_patient][doctors[i]].isAuthorized &&
                patientDoctorAccess[_patient][doctors[i]].expiryTime > block.timestamp) {
                count++;
            }
        }
        
        // Second pass: build filtered array
        address[] memory activeDoctors = new address[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < doctors.length; i++) {
            if (doctors[i] != address(0) && 
                patientDoctorAccess[_patient][doctors[i]].isAuthorized &&
                patientDoctorAccess[_patient][doctors[i]].expiryTime > block.timestamp) {
                activeDoctors[index] = doctors[i];
                index++;
            }
        }
        
        return activeDoctors;
    }
    
    /**
     * @dev Override transfer function to prevent transfers of access NFTs
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(
            from == address(0) || to == address(0), 
            "Access NFTs cannot be transferred"
        );
        super._transfer(from, to, tokenId);
    }
    
    /**
     * @dev Internal function to convert address to string
     */
    function _toString(address account) internal pure returns(string memory) {
        bytes32 value = bytes32(uint256(uint160(account)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    
    /**
     * @dev Internal function to convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
} 