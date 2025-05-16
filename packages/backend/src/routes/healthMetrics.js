const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

/**
 * @route POST /api/health-metrics/request/fitbit
 * @desc Request health metrics from Fitbit
 * @access Private
 */
router.post('/request/fitbit', async (req, res) => {
  try {
    const { accessToken, userAddress, signedMessage } = req.body;

    if (!accessToken || !userAddress || !signedMessage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Verify signed message to authenticate user
    const recoveredAddress = ethers.verifyMessage(
      'Request Fitbit metrics for Medilocker',
      signedMessage
    );

    if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Signature verification failed' 
      });
    }

    // Request metrics from Fitbit via Chainlink Functions
    const result = await req.chainlinkService.requestFitbitMetrics(
      userAddress,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: 'Fitbit metrics request submitted',
      result
    });
  } catch (error) {
    console.error('Error requesting Fitbit metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to request Fitbit metrics',
      error: error.message
    });
  }
});

/**
 * @route POST /api/health-metrics/request/googlefit
 * @desc Request health metrics from Google Fit
 * @access Private
 */
router.post('/request/googlefit', async (req, res) => {
  try {
    const { accessToken, userAddress, signedMessage } = req.body;

    if (!accessToken || !userAddress || !signedMessage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Verify signed message to authenticate user
    const recoveredAddress = ethers.verifyMessage(
      'Request Google Fit metrics for Medilocker',
      signedMessage
    );

    if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Signature verification failed' 
      });
    }

    // Request metrics from Google Fit via Chainlink Functions
    const result = await req.chainlinkService.requestGoogleFitMetrics(
      userAddress,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: 'Google Fit metrics request submitted',
      result
    });
  } catch (error) {
    console.error('Error requesting Google Fit metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to request Google Fit metrics',
      error: error.message
    });
  }
});

/**
 * @route GET /api/health-metrics/:userAddress/:source
 * @desc Get latest health metrics for a user from a specific source
 * @access Private
 */
router.get('/:userAddress/:source', async (req, res) => {
  try {
    const { userAddress, source } = req.params;
    const { signedMessage } = req.query;

    if (!userAddress || !source) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }

    // If request includes signed message, verify it
    if (signedMessage) {
      const recoveredAddress = ethers.verifyMessage(
        `Get ${source} metrics from Medilocker`,
        signedMessage
      );

      if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Signature verification failed' 
        });
      }
    }

    // Get latest metrics from the blockchain
    const metrics = await req.chainlinkService.getLatestHealthMetrics(
      userAddress,
      source
    );

    return res.status(200).json({
      success: true,
      message: `Latest ${source} metrics retrieved`,
      metrics
    });
  } catch (error) {
    console.error('Error getting health metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get health metrics',
      error: error.message
    });
  }
});

/**
 * @route GET /api/health-metrics/oauth-url/:provider
 * @desc Get OAuth URL for a specific provider
 * @access Public
 */
router.get('/oauth-url/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const { redirectUri } = req.query;

    if (!provider) {
      return res.status(400).json({ 
        success: false, 
        message: 'Provider is required' 
      });
    }

    let oauthUrl;

    switch (provider.toLowerCase()) {
      case 'fitbit':
        const fitbitClientId = process.env.FITBIT_CLIENT_ID;
        const fitbitScope = 'activity heartrate profile';
        oauthUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${fitbitClientId}&response_type=code&scope=${fitbitScope}&redirect_uri=${redirectUri}`;
        break;
        
      case 'googlefit':
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleScope = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read';
        oauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&response_type=code&scope=${googleScope}&redirect_uri=${redirectUri}`;
        break;
        
      default:
        return res.status(400).json({ 
          success: false, 
          message: `Unsupported provider: ${provider}` 
        });
    }

    return res.status(200).json({
      success: true,
      oauthUrl
    });
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate OAuth URL',
      error: error.message
    });
  }
});

module.exports = router; 