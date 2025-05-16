// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interfaces/IAccessControl.sol";

/**
 * @title MedicalRecordRegistry
 * @dev Stores SHA-256 hashes of medical records stored on IPFS
 * and provides access control for patients and authorized doctors
 */
contract MedicalRecordRegistry is Ownable {
    using ECDSA for bytes32;

    // Access control contract reference
    IAccessControl public accessControl;
    
    // Events
    event RecordAdded(address indexed patient, bytes32 recordHash, uint256 timestamp);
    event RecordAccessed(address indexed accessor, address indexed patient, bytes32 recordHash, uint256 timestamp);
    event RecordShared(address indexed patient, address indexed doctor, bytes32 recordHash, uint256 timestamp);
    event RecordAccessRevoked(address indexed patient, address indexed doctor, bytes32 recordHash, uint256 timestamp);

    // Structs
    struct MedicalRecord {
        bytes32 contentHash;    // SHA-256 hash of the encrypted content on IPFS
        string ipfsReference;   // IPFS CID reference
        uint256 timestamp;      // When the record was added
        string recordType;      // Type of medical record (e.g., "prescription", "labResult", "image")
        bool exists;            // Flag to check if record exists
    }
    
    // Mapping from patient address to their record hashes
    mapping(address => bytes32[]) private patientToRecords;
    
    // Mapping from record hash to record details
    mapping(bytes32 => MedicalRecord) private records;
    
    // Constructor
    constructor(address _accessControlAddress) Ownable(msg.sender) {
        accessControl = IAccessControl(_accessControlAddress);
    }
    
    /**
     * @dev Add a new medical record hash
     * @param _contentHash SHA-256 hash of the encrypted content
     * @param _ipfsReference IPFS CID of the encrypted record
     * @param _recordType Type of medical record
     */
    function addRecord(bytes32 _contentHash, string calldata _ipfsReference, string calldata _recordType) external {
        require(_contentHash != bytes32(0), "Invalid content hash");
        require(bytes(_ipfsReference).length > 0, "IPFS reference required");
        
        // Create record
        MedicalRecord memory newRecord = MedicalRecord({
            contentHash: _contentHash,
            ipfsReference: _ipfsReference,
            timestamp: block.timestamp,
            recordType: _recordType,
            exists: true
        });
        
        // Store record
        records[_contentHash] = newRecord;
        patientToRecords[msg.sender].push(_contentHash);
        
        emit RecordAdded(msg.sender, _contentHash, block.timestamp);
    }
    
    /**
     * @dev Get a patient's record by index (for the patient themselves)
     * @param _index Index in the patient's records array
     */
    function getMyRecord(uint256 _index) external view returns (
        bytes32 contentHash,
        string memory ipfsReference,
        uint256 timestamp,
        string memory recordType
    ) {
        require(_index < patientToRecords[msg.sender].length, "Record index out of bounds");
        
        bytes32 recordHash = patientToRecords[msg.sender][_index];
        MedicalRecord memory record = records[recordHash];
        
        return (
            record.contentHash,
            record.ipfsReference,
            record.timestamp,
            record.recordType
        );
    }
    
    /**
     * @dev Get the number of records for a patient
     */
    function getMyRecordCount() external view returns (uint256) {
        return patientToRecords[msg.sender].length;
    }
    
    /**
     * @dev Allow a doctor to access patient records
     * @param _patientAddress Address of the patient
     * @param _recordIndex Index of the record in patient's records
     */
    function accessPatientRecord(address _patientAddress, uint256 _recordIndex) external view returns (
        bytes32 contentHash,
        string memory ipfsReference,
        uint256 timestamp,
        string memory recordType
    ) {
        require(_recordIndex < patientToRecords[_patientAddress].length, "Record index out of bounds");
        
        // Check access permission
        require(
            accessControl.checkAccess(_patientAddress, msg.sender),
            "No access permission"
        );
        
        bytes32 recordHash = patientToRecords[_patientAddress][_recordIndex];
        MedicalRecord memory record = records[recordHash];
        
        return (
            record.contentHash,
            record.ipfsReference,
            record.timestamp,
            record.recordType
        );
    }
    
    /**
     * @dev Get all record hashes for a patient (only callable by the patient)
     */
    function getAllMyRecords() external view returns (bytes32[] memory) {
        return patientToRecords[msg.sender];
    }
    
    /**
     * @dev Check if a record exists
     * @param _recordHash Hash of the record to check
     */
    function recordExists(bytes32 _recordHash) external view returns (bool) {
        return records[_recordHash].exists;
    }
    
    /**
     * @dev Update the access control contract address
     * @param _newAccessControl Address of the new access control contract
     */
    function updateAccessControl(address _newAccessControl) external onlyOwner {
        require(_newAccessControl != address(0), "Invalid access control address");
        accessControl = IAccessControl(_newAccessControl);
    }
} 