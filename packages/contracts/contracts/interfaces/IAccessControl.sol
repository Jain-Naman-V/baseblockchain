// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IAccessControl
 * @dev Interface for the AccessControl contract that manages permissions
 * for doctors to access patient records
 */
interface IAccessControl {
    /**
     * @dev Grant access to a doctor for a patient's records
     * @param _doctor Address of the doctor to grant access
     * @param _expiryTime Timestamp after which access expires
     * @param _accessLevel Access level (1 = read-only, 2 = read-write)
     */
    function grantAccess(address _doctor, uint256 _expiryTime, uint8 _accessLevel) external;
    
    /**
     * @dev Revoke access from a doctor
     * @param _doctor Address of the doctor to revoke access from
     */
    function revokeAccess(address _doctor) external;
    
    /**
     * @dev Check if a doctor has access to a patient's records
     * @param _patient Address of the patient
     * @param _doctor Address of the doctor
     * @return True if the doctor has active access, false otherwise
     */
    function checkAccess(address _patient, address _doctor) external view returns (bool);
    
    /**
     * @dev Get the detailed access information for a doctor to a patient
     * @param _patient Address of the patient
     * @param _doctor Address of the doctor
     * @return isAuthorized Whether the doctor is authorized
     * @return expiryTime Timestamp when access expires
     * @return accessLevel Access level (1 = read-only, 2 = read-write)
     */
    function getAccessDetails(address _patient, address _doctor) external view returns (
        bool isAuthorized,
        uint256 expiryTime,
        uint8 accessLevel
    );
    
    /**
     * @dev Get all doctors with access to a patient's records
     * @param _patient Address of the patient
     * @return Array of doctor addresses with access
     */
    function getAllAuthorizedDoctors(address _patient) external view returns (address[] memory);
} 