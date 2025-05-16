'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { showToast, typewriter } from '../../utils/animations';

export default function DashboardPage() {
  // Data states (keeping functionality intact)
  const [isLoading, setIsLoading] = useState(true);
  const [recentRecords, setRecentRecords] = useState([
    { id: 1, date: "2024-06-15", type: "Annual Physical", doctor: "Dr. Smith", status: "Completed" },
    { id: 2, date: "2024-05-02", type: "Blood Test", doctor: "Dr. Johnson", status: "Completed" },
    { id: 3, date: "2024-06-30", type: "Dental Checkup", doctor: "Dr. Wilson", status: "Scheduled" }
  ]);
  
  const [patient, setPatient] = useState({
    name: "John Doe",
    age: 34,
    gender: "Male",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"]
  });

  const [healthData, setHealthData] = useState({
    heartRate: [72, 75, 70, 68, 73, 72, 74],
    bloodPressure: [
      { systolic: 120, diastolic: 80 },
      { systolic: 118, diastolic: 78 },
      { systolic: 122, diastolic: 82 },
      { systolic: 119, diastolic: 79 },
      { systolic: 121, diastolic: 81 },
      { systolic: 120, diastolic: 80 },
      { systolic: 118, diastolic: 78 }
    ],
    steps: [9200, 8500, 10200, 7800, 9500, 11000, 8547]
  });

  // Reference for typewriter effect
  const welcomeTextRef = useRef(null);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Show welcome toast after loading
      setTimeout(() => {
        showToast(`Welcome back, ${patient.name}!`, 'success');
      }, 500);
      
      // Apply typewriter effect to welcome text
      if (welcomeTextRef.current) {
        typewriter(
          welcomeTextRef.current, 
          `Hello ${patient.name}, welcome to your health dashboard`
        );
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [patient.name]);
  
  // Health metrics chart rendering
  const renderHealthChart = () => {
    const maxSteps = Math.max(...healthData.steps);
    
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-medium mb-3 text-gray-800">Weekly Health Trends</h3>
        <div className="flex items-end h-40 gap-3">
          {healthData.steps.map((steps, index) => {
            const height = (steps / maxSteps) * 100;
            const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
            const heartRate = healthData.heartRate[index];
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full relative">
                  <div 
                    className="w-full bg-blue-200 rounded-t relative cursor-pointer transition-all hover:bg-blue-300"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute bottom-full left-0 w-full mb-1 text-center">
                      <span className="text-xs font-medium text-gray-800">{steps}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white p-1 rounded shadow text-xs">
                        HR: {heartRate} bpm
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs mt-1 text-gray-800">{day}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Average Steps: 9,249</span>
            <span className="text-xs text-gray-600">Goal: 10,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 py-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Welcome Text */}
          <div>
            <h1 
              ref={welcomeTextRef} 
              className="text-2xl font-bold text-gray-800 mb-1 min-h-[2.5rem]"
            ></h1>
            <p className="text-sm text-gray-600">
              Your medical data is securely stored on the Base blockchain
            </p>
          </div>
          
          {/* User Profile Card */}
          <div className="bg-blue-50 rounded-lg shadow px-3 py-2 flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold mr-2">
              {patient.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-800">{patient.name}</p>
              <p className="text-xs text-gray-600">
                <span className="inline-flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  <span>Verified Patient</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Records */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1 font-medium">Total Records</p>
            <p className="text-xl font-bold text-gray-800" data-counter data-target="12">0</p>
            <div className="mt-1 flex items-center text-xs text-green-600">
              <span className="text-green-500 mr-1">↑</span>
              <span>+2 this month</span>
            </div>
          </div>
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1 font-medium">Upcoming Appointments</p>
            <p className="text-xl font-bold text-gray-800" data-counter data-target="2">0</p>
            <div className="mt-1 text-xs text-gray-600">
              Next: Jun 30, 2024
            </div>
          </div>
          
          {/* Verified Documents */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1 font-medium">Verified Documents</p>
            <p className="text-xl font-bold text-gray-800" data-counter data-target="8">0</p>
            <div className="mt-1 flex items-center text-xs text-blue-600">
              <span className="text-blue-500 mr-1">✓</span>
              <span>Base verified</span>
            </div>
          </div>
          
          {/* Providers Connected */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm mb-1 font-medium">Providers Connected</p>
            <p className="text-xl font-bold text-gray-800" data-counter data-target="3">0</p>
            <div className="mt-1 text-xs text-gray-600">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 border border-white"></div>
                <div className="w-5 h-5 rounded-full bg-green-100 border border-white"></div>
                <div className="w-5 h-5 rounded-full bg-yellow-100 border border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Recent Records */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Recent Medical Records</h2>
                <Link href="/records" className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-50">
                  View All →
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs">
                    <tr>
                      <th className="p-2 border-b border-gray-200 font-medium text-gray-600">Date</th>
                      <th className="p-2 border-b border-gray-200 font-medium text-gray-600">Type</th>
                      <th className="p-2 border-b border-gray-200 font-medium text-gray-600">Doctor</th>
                      <th className="p-2 border-b border-gray-200 font-medium text-gray-600">Status</th>
                      <th className="p-2 border-b border-gray-200 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.map((record, index) => (
                      <tr 
                        key={record.id} 
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-xs"
                      >
                        <td className="p-2 text-gray-800">{record.date}</td>
                        <td className="p-2 text-gray-800">{record.type}</td>
                        <td className="p-2 text-gray-800">{record.doctor}</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status === 'Completed' && <span className="mr-1">✓</span>}
                            {record.status === 'Scheduled' && <span className="mr-1">⏱️</span>}
                            {record.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <span className="text-xs">👁️</span>
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <span className="text-xs">⬇️</span>
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <span className="text-xs">🔄</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Health Chart */}
            <div>
              {renderHealthChart()}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-lg font-medium mb-3 text-gray-800">Quick Actions</h2>
              <div className="space-y-2">
                <Link 
                  href="/records/new" 
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded text-sm"
                >
                  Add New Record
                </Link>
                <Link 
                  href="/profile" 
                  className="block w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-center py-2 px-3 rounded text-sm"
                >
                  Update Profile
                </Link>
                <Link 
                  href="/permissions" 
                  className="block w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-center py-2 px-3 rounded text-sm"
                >
                  Manage Permissions
                </Link>
              </div>
            </div>
            
            {/* Blockchain Status */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-3 text-gray-800">Blockchain Status</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-600">Connected Network</p>
                  <p className="font-medium flex items-center text-gray-800">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    Base Mainnet
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Last Sync</p>
                  <p className="font-medium text-gray-800">10 minutes ago</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Gas Price</p>
                  <p className="font-medium text-gray-800">0.045 Gwei</p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <img 
                      src="https://base.org/assets/images/base-logo.svg" 
                      alt="Base" 
                      className="h-6 mx-auto mb-2"
                    />
                    <p className="text-xs text-gray-600">Your data is securely stored on Base blockchain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 