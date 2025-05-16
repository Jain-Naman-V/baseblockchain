const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

/**
 * Chainlink Functions service for fetching health metrics from external APIs
 */
class ChainlinkService {
  constructor(config) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    
    // Load contract ABIs
    this.chainlinkOracleAbi = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../abis/ChainlinkOracle.json')
      )
    );
    
    this.oracleAddress = config.oracleAddress;
    this.oracleContract = new ethers.Contract(
      this.oracleAddress,
      this.chainlinkOracleAbi,
      this.wallet
    );
  }

  /**
   * Get Fitbit source code for Chainlink Functions
   * @param {string} accessToken - OAuth token for Fitbit API
   * @returns {string} - JavaScript source code for the Chainlink Function
   */
  getFitbitSourceCode(accessToken) {
    return `
      // Fitbit API fetcher for Chainlink Functions
      const apiKey = "${accessToken}";
      
      // Function to fetch heart rate data
      async function fetchHeartRate() {
        const url = "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json";
        const response = await Functions.makeHttpRequest({
          url,
          headers: {
            "Authorization": \`Bearer \${apiKey}\`
          }
        });
        
        if (response.error) {
          throw new Error(\`Fitbit API error: \${response.error}\`);
        }
        
        return response.data;
      }
      
      // Function to fetch activity data
      async function fetchActivity() {
        const url = "https://api.fitbit.com/1/user/-/activities/date/today.json";
        const response = await Functions.makeHttpRequest({
          url,
          headers: {
            "Authorization": \`Bearer \${apiKey}\`
          }
        });
        
        if (response.error) {
          throw new Error(\`Fitbit API error: \${response.error}\`);
        }
        
        return response.data;
      }
      
      // Main execution function
      async function execute() {
        try {
          const [heartRateData, activityData] = await Promise.all([
            fetchHeartRate(),
            fetchActivity()
          ]);
          
          // Extract key metrics
          const healthMetrics = {
            timestamp: Date.now(),
            heartRate: {
              restingHeartRate: heartRateData?.activities?.[0]?.restingHeartRate || null,
              zones: heartRateData?.activities?.[0]?.heartRateZones || []
            },
            activity: {
              steps: activityData?.summary?.steps || 0,
              distance: activityData?.summary?.distances?.[0]?.distance || 0,
              activeMinutes: activityData?.summary?.fairlyActiveMinutes + activityData?.summary?.veryActiveMinutes || 0,
              calories: activityData?.summary?.caloriesOut || 0
            }
          };
          
          return Functions.encodeString(JSON.stringify(healthMetrics));
        } catch (error) {
          return Functions.encodeString(JSON.stringify({ error: error.message }));
        }
      }
      
      // Execute the function
      execute();
    `;
  }

  /**
   * Get Google Fit source code for Chainlink Functions
   * @param {string} accessToken - OAuth token for Google Fit API
   * @returns {string} - JavaScript source code for the Chainlink Function
   */
  getGoogleFitSourceCode(accessToken) {
    return `
      // Google Fit API fetcher for Chainlink Functions
      const apiKey = "${accessToken}";
      
      // Function to fetch fitness data
      async function fetchFitnessData() {
        const url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
        const now = Date.now();
        const oneDayAgo = now - 86400000; // 24 hours in milliseconds
        
        const body = {
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
              dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            },
            {
              dataTypeName: "com.google.heart_rate.bpm"
            },
            {
              dataTypeName: "com.google.calories.expended"
            },
            {
              dataTypeName: "com.google.distance.delta"
            }
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: oneDayAgo,
          endTimeMillis: now
        };
        
        const response = await Functions.makeHttpRequest({
          url,
          method: "POST",
          headers: {
            "Authorization": \`Bearer \${apiKey}\`,
            "Content-Type": "application/json"
          },
          data: body
        });
        
        if (response.error) {
          throw new Error(\`Google Fit API error: \${response.error}\`);
        }
        
        return response.data;
      }
      
      // Main execution function
      async function execute() {
        try {
          const fitnessData = await fetchFitnessData();
          
          // Process and extract the data
          const bucket = fitnessData.bucket[0];
          const healthMetrics = {
            timestamp: Date.now(),
            steps: 0,
            heartRate: { average: null, min: null, max: null },
            calories: 0,
            distance: 0
          };
          
          // Extract metrics from each dataset
          bucket.dataset.forEach(dataset => {
            const dataType = dataset.dataSourceId || '';
            const points = dataset.point || [];
            
            if (dataType.includes('step_count')) {
              points.forEach(point => {
                point.value.forEach(val => {
                  healthMetrics.steps += val.intVal || 0;
                });
              });
            }
            else if (dataType.includes('heart_rate')) {
              let values = [];
              points.forEach(point => {
                point.value.forEach(val => {
                  if (val.fpVal) values.push(val.fpVal);
                });
              });
              
              if (values.length > 0) {
                healthMetrics.heartRate.average = values.reduce((sum, val) => sum + val, 0) / values.length;
                healthMetrics.heartRate.min = Math.min(...values);
                healthMetrics.heartRate.max = Math.max(...values);
              }
            }
            else if (dataType.includes('calories')) {
              points.forEach(point => {
                point.value.forEach(val => {
                  healthMetrics.calories += val.fpVal || 0;
                });
              });
            }
            else if (dataType.includes('distance')) {
              points.forEach(point => {
                point.value.forEach(val => {
                  healthMetrics.distance += val.fpVal || 0;
                });
              });
            }
          });
          
          return Functions.encodeString(JSON.stringify(healthMetrics));
        } catch (error) {
          return Functions.encodeString(JSON.stringify({ error: error.message }));
        }
      }
      
      // Execute the function
      execute();
    `;
  }

  /**
   * Request health metrics from Fitbit
   * @param {string} userAddress - Address of the user requesting metrics
   * @param {string} accessToken - OAuth token for Fitbit API
   * @returns {Promise<Object>} - Transaction details
   */
  async requestFitbitMetrics(userAddress, accessToken) {
    try {
      const sourceCode = this.getFitbitSourceCode(accessToken);
      const args = [];
      
      const tx = await this.oracleContract.requestHealthMetrics(
        'fitbit',
        args,
        sourceCode
      );
      
      await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        message: 'Successfully requested Fitbit metrics'
      };
    } catch (error) {
      console.error('Error requesting Fitbit metrics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Request health metrics from Google Fit
   * @param {string} userAddress - Address of the user requesting metrics
   * @param {string} accessToken - OAuth token for Google Fit API
   * @returns {Promise<Object>} - Transaction details
   */
  async requestGoogleFitMetrics(userAddress, accessToken) {
    try {
      const sourceCode = this.getGoogleFitSourceCode(accessToken);
      const args = [];
      
      const tx = await this.oracleContract.requestHealthMetrics(
        'googlefit',
        args,
        sourceCode
      );
      
      await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        message: 'Successfully requested Google Fit metrics'
      };
    } catch (error) {
      console.error('Error requesting Google Fit metrics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get latest health metrics for a user
   * @param {string} userAddress - Address of the user
   * @param {string} source - Source of health data (e.g., "fitbit", "googlefit")
   * @returns {Promise<Object>} - Health metrics data
   */
  async getLatestHealthMetrics(userAddress, source) {
    try {
      const [metrics, timestamp] = await this.oracleContract.getLatestHealthMetrics(
        userAddress,
        source
      );
      
      // Parse the metrics if it's JSON
      let parsedMetrics;
      try {
        parsedMetrics = JSON.parse(metrics);
      } catch (e) {
        parsedMetrics = metrics;
      }
      
      return {
        success: true,
        metrics: parsedMetrics,
        timestamp: timestamp.toString(),
        timestampDate: new Date(Number(timestamp) * 1000).toISOString()
      };
    } catch (error) {
      console.error('Error getting health metrics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = ChainlinkService; 