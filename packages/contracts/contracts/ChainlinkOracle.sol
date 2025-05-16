// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/functions/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/FunctionsRequest.sol";

/**
 * @title ChainlinkOracle
 * @dev Handles fetching health metrics from external APIs via Chainlink Functions
 */
contract ChainlinkOracle is Ownable, FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink Functions config
    bytes32 public donId;
    uint64 public subscriptionId;
    uint32 public gasLimit = 300000;
    
    // Mapping from requestId to patient address
    mapping(bytes32 => address) private requestToPatient;
    
    // Mapping from requestId to data source type
    mapping(bytes32 => string) private requestToSource;
    
    // Mapping patient to their last metrics by source type
    mapping(address => mapping(string => string)) private patientMetrics;
    
    // Mapping from patient to their last update timestamp by source
    mapping(address => mapping(string => uint256)) private lastUpdated;
    
    // Events
    event HealthMetricRequested(bytes32 indexed requestId, address indexed patient, string source);
    event HealthMetricFulfilled(bytes32 indexed requestId, address indexed patient, string source, uint256 timestamp);
    
    /**
     * @dev Constructor
     * @param _router Chainlink Functions Router address
     * @param _donId DON ID for Chainlink Functions
     * @param _subscriptionId Chainlink Functions subscription ID
     */
    constructor(
        address _router,
        bytes32 _donId,
        uint64 _subscriptionId
    ) Ownable(msg.sender) FunctionsClient(_router) {
        donId = _donId;
        subscriptionId = _subscriptionId;
    }
    
    /**
     * @dev Request health metrics from an external API via Chainlink Functions
     * @param source Source of health data (e.g., "fitbit", "googlefit")
     * @param args Arguments to pass to the source API
     * @param sourceCode JavaScript code to execute in the Chainlink DON
     */
    function requestHealthMetrics(
        string calldata source,
        string[] calldata args,
        string calldata sourceCode
    ) external {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sourceCode);
        
        if (args.length > 0) {
            req.setArgs(args);
        }
        
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donId
        );
        
        requestToPatient[requestId] = msg.sender;
        requestToSource[requestId] = source;
        
        emit HealthMetricRequested(requestId, msg.sender, source);
    }
    
    /**
     * @dev Callback function for Chainlink Functions to deliver the result
     * @param requestId The ID of the request
     * @param response The response from the external API
     * @param err Any error that occurred
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        address patient = requestToPatient[requestId];
        string memory source = requestToSource[requestId];
        
        // If there's an error, store the error string
        if (err.length > 0) {
            string memory errorString = string(err);
            patientMetrics[patient][source] = string(abi.encodePacked("Error: ", errorString));
        } else {
            // Store the health metrics data
            patientMetrics[patient][source] = string(response);
        }
        
        // Update the timestamp
        lastUpdated[patient][source] = block.timestamp;
        
        emit HealthMetricFulfilled(requestId, patient, source, block.timestamp);
    }
    
    /**
     * @dev Get latest health metrics for a patient from a specific source
     * @param patient Patient address
     * @param source Source of health data
     * @return metrics The health metrics data
     * @return timestamp When the metrics were last updated
     */
    function getLatestHealthMetrics(address patient, string calldata source) 
        external 
        view 
        returns (string memory metrics, uint256 timestamp) 
    {
        return (
            patientMetrics[patient][source],
            lastUpdated[patient][source]
        );
    }
    
    /**
     * @dev Update the subscription ID for Chainlink Functions
     * @param _subscriptionId New subscription ID
     */
    function updateSubscriptionId(uint64 _subscriptionId) external onlyOwner {
        subscriptionId = _subscriptionId;
    }
    
    /**
     * @dev Update the DON ID for Chainlink Functions
     * @param _donId New DON ID
     */
    function updateDonId(bytes32 _donId) external onlyOwner {
        donId = _donId;
    }
    
    /**
     * @dev Update the gas limit for Chainlink Functions requests
     * @param _gasLimit New gas limit
     */
    function updateGasLimit(uint32 _gasLimit) external onlyOwner {
        gasLimit = _gasLimit;
    }
} 