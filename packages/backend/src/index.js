const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Medilocker backend is running',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Medilocker API - Welcome to the decentralized medical data vault!');
});

// Mock API endpoints
app.get('/api/records', (req, res) => {
  res.json({
    success: true,
    records: [
      { id: '1', title: 'Annual Physical', date: '2023-10-15', type: 'examination' },
      { id: '2', title: 'Blood Test', date: '2023-09-22', type: 'labResult' },
      { id: '3', title: 'COVID-19 Vaccination', date: '2023-08-05', type: 'vaccination' }
    ]
  });
});

app.get('/api/health-metrics', (req, res) => {
  res.json({
    success: true,
    metrics: {
      heartRate: { average: 72, max: 142, min: 58 },
      steps: 8754,
      calories: 2105,
      sleep: { hours: 7.2, quality: 'Good' }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Medilocker backend server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 