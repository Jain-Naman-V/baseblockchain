const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

/**
 * @route POST /api/records/upload
 * @desc Upload an encrypted medical record to IPFS and register on-chain
 * @access Private
 */
router.post('/upload', async (req, res) => {
  try {
    const { 
      data, 
      encryptionKey, 
      patientAddress, 
      recordType,
      signedMessage
    } = req.body;

    if (!data || !encryptionKey || !patientAddress || !recordType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Verify signed message to authenticate user
    // This is a simplified version - in production you'd want more robust verification
    const recoveredAddress = ethers.verifyMessage(
      'Upload medical record to Medilocker',
      signedMessage
    );

    if (recoveredAddress.toLowerCase() !== patientAddress.toLowerCase()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Signature verification failed' 
      });
    }

    // Upload encrypted data to IPFS
    const ipfsResult = await req.ipfsService.uploadEncrypted(
      data,
      encryptionKey
    );

    // Pin file in IPFS for persistence
    await req.ipfsService.pinFile(ipfsResult.cid);

    // Return details for on-chain registration
    // In a real app, we would also register this on-chain via the frontend
    return res.status(200).json({
      success: true,
      message: 'Medical record uploaded successfully',
      result: {
        cid: ipfsResult.cid,
        ipfsUrl: ipfsResult.ipfsUrl,
        contentHash: ipfsResult.contentHash,
        recordType
      }
    });
  } catch (error) {
    console.error('Error uploading record:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload medical record',
      error: error.message
    });
  }
});

/**
 * @route GET /api/records/retrieve/:cid
 * @desc Retrieve and decrypt a medical record from IPFS
 * @access Private
 */
router.get('/retrieve/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { encryptionKey, signedMessage, patientAddress } = req.query;

    if (!cid || !encryptionKey) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing CID or encryption key' 
      });
    }

    // Verify signed message to authenticate user
    // Again, simplified for demonstration
    if (signedMessage && patientAddress) {
      const recoveredAddress = ethers.verifyMessage(
        'Retrieve medical record from Medilocker',
        signedMessage
      );

      if (recoveredAddress.toLowerCase() !== patientAddress.toLowerCase()) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Signature verification failed' 
        });
      }
    }

    // Retrieve and decrypt data
    const decryptedData = await req.ipfsService.retrieveAndDecrypt(
      cid,
      encryptionKey
    );

    return res.status(200).json({
      success: true,
      message: 'Medical record retrieved successfully',
      data: decryptedData
    });
  } catch (error) {
    console.error('Error retrieving record:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve medical record',
      error: error.message
    });
  }
});

/**
 * @route GET /api/records/generate-key
 * @desc Generate an encryption key for a patient
 * @access Public
 */
router.get('/generate-key', (req, res) => {
  try {
    const { address, salt } = req.query;

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address is required' 
      });
    }

    const encryptionKey = req.ipfsService.generateEncryptionKey(address, salt || '');

    return res.status(200).json({
      success: true,
      encryptionKey
    });
  } catch (error) {
    console.error('Error generating encryption key:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate encryption key',
      error: error.message
    });
  }
});

module.exports = router; 