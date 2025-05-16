const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Load environment variables
const RPC_URL = process.env.RPC_URL;
const ACCESS_CONTROL_ADDRESS = process.env.ACCESS_CONTROL_ADDRESS;

// Load contract ABI (would be loaded from JSON file in production)
const ACCESS_CONTROL_ABI = [
  "function grantAccess(address _doctor, uint256 _expiryTime, uint8 _accessLevel) external",
  "function revokeAccess(address _doctor) external",
  "function checkAccess(address _patient, address _doctor) external view returns (bool)",
  "function getAccessDetails(address _patient, address _doctor) external view returns (bool isAuthorized, uint256 expiryTime, uint8 accessLevel)",
  "function getAllAuthorizedDoctors(address _patient) external view returns (address[] memory)"
];

/**
 * @route POST /api/access-control/grant
 * @desc Grant access to a doctor
 * @access Private
 */
router.post('/grant', async (req, res) => {
  try {
    const { 
      doctorAddress, 
      patientAddress, 
      expiryTime, 
      accessLevel, 
      signedMessage,
      privateKey
    } = req.body;

    if (!doctorAddress || !patientAddress || !expiryTime || !accessLevel) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Verify signature if provided
    if (signedMessage) {
      const recoveredAddress = ethers.verifyMessage(
        `Grant access to ${doctorAddress} for Medilocker`,
        signedMessage
      );

      if (recoveredAddress.toLowerCase() !== patientAddress.toLowerCase()) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Signature verification failed' 
        });
      }
    }

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Use either provided private key or the configured one
    const wallet = privateKey 
      ? new ethers.Wallet(privateKey, provider)
      : new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const accessControlContract = new ethers.Contract(
      ACCESS_CONTROL_ADDRESS,
      ACCESS_CONTROL_ABI,
      wallet
    );

    // Grant access
    const tx = await accessControlContract.grantAccess(
      doctorAddress,
      expiryTime,
      accessLevel
    );

    await tx.wait();

    return res.status(200).json({
      success: true,
      message: 'Access granted successfully',
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error('Error granting access:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to grant access',
      error: error.message
    });
  }
});

/**
 * @route POST /api/access-control/revoke
 * @desc Revoke access from a doctor
 * @access Private
 */
router.post('/revoke', async (req, res) => {
  try {
    const { 
      doctorAddress, 
      patientAddress, 
      signedMessage,
      privateKey
    } = req.body;

    if (!doctorAddress || !patientAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Verify signature if provided
    if (signedMessage) {
      const recoveredAddress = ethers.verifyMessage(
        `Revoke access from ${doctorAddress} for Medilocker`,
        signedMessage
      );

      if (recoveredAddress.toLowerCase() !== patientAddress.toLowerCase()) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Signature verification failed' 
        });
      }
    }

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Use either provided private key or the configured one
    const wallet = privateKey 
      ? new ethers.Wallet(privateKey, provider)
      : new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const accessControlContract = new ethers.Contract(
      ACCESS_CONTROL_ADDRESS,
      ACCESS_CONTROL_ABI,
      wallet
    );

    // Revoke access
    const tx = await accessControlContract.revokeAccess(doctorAddress);
    await tx.wait();

    return res.status(200).json({
      success: true,
      message: 'Access revoked successfully',
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error('Error revoking access:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to revoke access',
      error: error.message
    });
  }
});

/**
 * @route GET /api/access-control/check/:patientAddress/:doctorAddress
 * @desc Check if a doctor has access to a patient's records
 * @access Public
 */
router.get('/check/:patientAddress/:doctorAddress', async (req, res) => {
  try {
    const { patientAddress, doctorAddress } = req.params;

    if (!patientAddress || !doctorAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const accessControlContract = new ethers.Contract(
      ACCESS_CONTROL_ADDRESS,
      ACCESS_CONTROL_ABI,
      provider
    );

    // Check access
    const hasAccess = await accessControlContract.checkAccess(
      patientAddress,
      doctorAddress
    );

    return res.status(200).json({
      success: true,
      hasAccess
    });
  } catch (error) {
    console.error('Error checking access:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check access',
      error: error.message
    });
  }
});

/**
 * @route GET /api/access-control/details/:patientAddress/:doctorAddress
 * @desc Get detailed access information for a doctor to a patient
 * @access Private
 */
router.get('/details/:patientAddress/:doctorAddress', async (req, res) => {
  try {
    const { patientAddress, doctorAddress } = req.params;
    const { signedMessage } = req.query;

    if (!patientAddress || !doctorAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }

    // Verify signature if provided
    if (signedMessage) {
      const recoveredAddress = ethers.verifyMessage(
        `Get access details for ${doctorAddress} in Medilocker`,
        signedMessage
      );

      if (recoveredAddress.toLowerCase() !== patientAddress.toLowerCase() && 
          recoveredAddress.toLowerCase() !== doctorAddress.toLowerCase()) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Signature verification failed' 
        });
      }
    }

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const accessControlContract = new ethers.Contract(
      ACCESS_CONTROL_ADDRESS,
      ACCESS_CONTROL_ABI,
      provider
    );

    // Get access details
    const [isAuthorized, expiryTime, accessLevel] = await accessControlContract.getAccessDetails(
      patientAddress,
      doctorAddress
    );

    return res.status(200).json({
      success: true,
      accessDetails: {
        isAuthorized,
        expiryTime: expiryTime.toString(),
        expiryDate: new Date(Number(expiryTime) * 1000).toISOString(),
        accessLevel: Number(accessLevel)
      }
    });
  } catch (error) {
    console.error('Error getting access details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get access details',
      error: error.message
    });
  }
});

/**
 * @route GET /api/access-control/authorized-doctors/:patientAddress
 * @desc Get all doctors authorized to access a patient's records
 * @access Private
 */
router.get('/authorized-doctors/:patientAddress', async (req, res) => {
  try {
    const { patientAddress } = req.params;
    const { signedMessage } = req.query;

    if (!patientAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Patient address is required' 
      });
    }

    // Verify signature if provided
    if (signedMessage) {
      const recoveredAddress = ethers.verifyMessage(
        'Get all authorized doctors for Medilocker',
        signedMessage
      );

      if (recoveredAddress.toLowerCase() !== patientAddress.toLowerCase()) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Signature verification failed' 
        });
      }
    }

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const accessControlContract = new ethers.Contract(
      ACCESS_CONTROL_ADDRESS,
      ACCESS_CONTROL_ABI,
      provider
    );

    // Get all authorized doctors
    const authorizedDoctors = await accessControlContract.getAllAuthorizedDoctors(patientAddress);

    return res.status(200).json({
      success: true,
      authorizedDoctors
    });
  } catch (error) {
    console.error('Error getting authorized doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get authorized doctors',
      error: error.message
    });
  }
});

module.exports = router; 