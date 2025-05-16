import { NextResponse } from 'next/server';

// Mock health metrics data
const healthMetrics = {
  heartRate: { 
    current: 72, 
    average: 75, 
    min: 62, 
    max: 120,
    history: [
      { timestamp: '2023-11-05T08:00:00Z', value: 68 },
      { timestamp: '2023-11-05T12:00:00Z', value: 72 },
      { timestamp: '2023-11-05T16:00:00Z', value: 75 },
      { timestamp: '2023-11-05T20:00:00Z', value: 70 }
    ]
  },
  bloodPressure: { 
    systolic: 120, 
    diastolic: 80, 
    lastMeasured: "2023-11-01",
    history: [
      { timestamp: '2023-10-01T09:00:00Z', systolic: 118, diastolic: 78 },
      { timestamp: '2023-10-15T09:00:00Z', systolic: 122, diastolic: 82 },
      { timestamp: '2023-11-01T09:00:00Z', systolic: 120, diastolic: 80 }
    ]
  },
  weight: { 
    current: 70.5, 
    unit: "kg", 
    lastMeasured: "2023-11-01",
    history: [
      { timestamp: '2023-10-01T07:00:00Z', value: 71.2 },
      { timestamp: '2023-10-15T07:00:00Z', value: 70.8 },
      { timestamp: '2023-11-01T07:00:00Z', value: 70.5 }
    ]
  },
  steps: { 
    today: 8547, 
    average: 9200, 
    goal: 10000,
    history: [
      { date: '2023-11-01', count: 9453 },
      { date: '2023-11-02', count: 10248 },
      { date: '2023-11-03', count: 8756 },
      { date: '2023-11-04', count: 7890 },
      { date: '2023-11-05', count: 8547 }
    ]
  },
  sleep: { 
    lastNight: 7.2, 
    average: 7.5, 
    unit: "hours",
    history: [
      { date: '2023-11-01', duration: 7.8, quality: 'Good' },
      { date: '2023-11-02', duration: 6.9, quality: 'Fair' },
      { date: '2023-11-03', duration: 8.1, quality: 'Excellent' },
      { date: '2023-11-04', duration: 7.5, quality: 'Good' },
      { date: '2023-11-05', duration: 7.2, quality: 'Good' }
    ]
  },
  calories: {
    today: 2105,
    burned: 420,
    goal: 2000,
    macros: {
      carbs: { value: 225, unit: 'g', percentage: 45 },
      protein: { value: 125, unit: 'g', percentage: 25 },
      fat: { value: 67, unit: 'g', percentage: 30 }
    }
  },
  activity: {
    today: [
      { type: 'Running', duration: 30, caloriesBurned: 320 },
      { type: 'Walking', duration: 45, caloriesBurned: 100 }
    ],
    weeklyTotal: 185,
    weeklyGoal: 210
  }
};

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({ 
    success: true, 
    data: healthMetrics,
    lastSync: new Date().toISOString(),
    sources: [
      { name: 'Fitbit', lastSync: '2023-11-05T22:30:00Z', status: 'connected' },
      { name: 'Apple Health', lastSync: '2023-11-05T23:00:00Z', status: 'connected' }
    ],
    blockchain: {
      network: "Base L2 Testnet",
      verificationHash: "0x" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)
    }
  });
} 