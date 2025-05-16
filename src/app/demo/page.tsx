'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Demo page for Medilocker
export default function DemoPage() {
  // Wallet connection states
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  
  // Base network information
  const [blockNumber, setBlockNumber] = useState(16428790);
  const [gasPrice, setGasPrice] = useState('0.052');
  const [baseName, setBaseName] = useState<string | null>(null);
  
  // Medical data
  const [records, setRecords] = useState([
    { id: 1, date: "2024-06-15", type: "Annual Physical", doctor: "Dr. Smith", status: "Completed", txHash: "0x1234567890abcdef1234567890abcdef12345678" },
    { id: 2, date: "2024-05-02", type: "Blood Test", doctor: "Dr. Johnson", status: "Completed", txHash: "0xabcdef1234567890abcdef1234567890abcdef12" },
    { id: 3, date: "2024-03-18", type: "MRI Scan", doctor: "Dr. Patel", status: "Completed", txHash: "0x9876543210abcdef1234567890abcdef12345678" },
    { id: 4, date: "2024-06-30", type: "Dental Checkup", doctor: "Dr. Wilson", status: "Scheduled" }
  ]);
  
  // Health metrics
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: { current: 72, average: 75, min: 62, max: 120 },
    bloodPressure: { systolic: 120, diastolic: 80, lastMeasured: "2024-06-01" },
    weight: { current: 70.5, unit: "kg", lastMeasured: "2024-06-01" },
    steps: { today: 8547, average: 9200, goal: 10000 },
    sleep: { lastNight: 7.2, average: 7.5, unit: "hours" }
  });
  
  // Patient information
  const [patient, setPatient] = useState({
    name: "John Doe",
    age: 34,
    gender: "Male",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    address: "123 Main St, Boston, MA",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    emergencyContact: "Jane Doe - (555) 987-6543"
  });
  
  // Demo connect wallet function
  const connectWallet = () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      setAddress(mockAddress);
      setBaseName(`user${mockAddress.substring(2, 6)}.base`);
      setIsConnected(true);
      setIsConnecting(false);
      
      // Simulate block updates
      startBlockUpdates();
    }, 1500);
  };
  
  // Start mock block updates
  const startBlockUpdates = () => {
    const interval = setInterval(() => {
      setBlockNumber(prev => prev + 1);
      
      // Random fluctuation in gas price
      const randomChange = (Math.random() - 0.5) * 0.005;
      setGasPrice(prev => (parseFloat(prev) + randomChange).toFixed(3));
    }, 5000);
    
    // Clean up
    return () => clearInterval(interval);
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBaseName(null);
  };
  
  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // If not connected, show welcome screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <img 
              src="https://base.org/assets/images/base-logo.svg" 
              alt="Base Logo" 
              className="w-24 mb-8" 
            />
            <h1 className="text-4xl font-bold text-sky-600 mb-4">Welcome to Medilocker</h1>
            <p className="text-slate-600 max-w-lg mb-8 text-lg">
              A decentralized medical data vault built on <strong>Base L2</strong> blockchain. Secure your medical 
              records with blockchain verification and control access with NFT-based permissions.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mb-8">
              <h3 className="text-xl font-semibold text-sky-600 mb-2">Connect to Base Network</h3>
              <p className="text-slate-600 mb-4">
                Connect your wallet to the Base network to access your secure medical records.
                Your data is encrypted, hashed, and verified on the Base L2 blockchain.
              </p>
              
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className={`${
                  isConnecting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-2 px-6 rounded-lg font-medium transition-colors`}
              >
                {isConnecting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <div className="text-sky-600 text-xl font-semibold mb-1">Secure Storage</div>
                <p className="text-slate-600 text-sm">IPFS & Base L2 blockchain verification</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <div className="text-sky-600 text-xl font-semibold mb-1">Access Control</div>
                <p className="text-slate-600 text-sm">NFT-based permissions for providers</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <div className="text-sky-600 text-xl font-semibold mb-1">Data Integrity</div>
                <p className="text-slate-600 text-sm">SHA-256 hashing & blockchain verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="https://base.org/assets/images/base-logo.svg" 
              alt="Base Logo" 
              className="w-6 h-6" 
            />
            <h1 className="text-2xl font-bold text-sky-600">Medilocker</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
              Base Network
            </div>
            
            <div className="relative group">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                {address && formatAddress(address)}
              </button>
              
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button 
                  onClick={disconnectWallet}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Base Network Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex justify-between items-center flex-wrap">
          <div className="flex items-center">
            <img 
              src="https://base.org/assets/images/base-logo.svg" 
              alt="Base Logo" 
              className="w-6 mr-3" 
            />
            <div>
              <p className="font-semibold">Base Network Status</p>
              <p className="text-sm text-blue-800">Connected to Base Mainnet</p>
            </div>
          </div>
          
          <div className="flex gap-6 flex-wrap">
            <div>
              <p className="text-xs text-slate-500">LATEST BLOCK</p>
              <p className="font-semibold">{blockNumber.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">GAS PRICE</p>
              <p className="font-semibold">{gasPrice} Gwei</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">BASE NAME</p>
              <p className="font-semibold">{baseName || 'Not registered'}</p>
            </div>
          </div>
        </div>
        
        {/* Patient Info */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-8">
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-full bg-slate-200 bg-cover bg-center border-4 border-sky-600" 
                   style={{ backgroundImage: `url('https://randomuser.me/api/portraits/men/44.jpg')` }}>
              </div>
              <button className="w-full mt-3 py-1 px-2 bg-slate-100 border border-slate-200 rounded text-sm">
                Edit Profile
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Patient Information</h2>
                <div className="text-sm text-blue-600">
                  <a href="#" className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {address && formatAddress(address)}
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name</p>
                  <p className="text-slate-600">{patient.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Age</p>
                  <p className="text-slate-600">{patient.age}</p>
                </div>
                <div>
                  <p className="font-semibold">Gender</p>
                  <p className="text-slate-600">{patient.gender}</p>
                </div>
                <div>
                  <p className="font-semibold">Blood Type</p>
                  <p className="text-slate-600">{patient.bloodType}</p>
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-slate-600">{patient.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-slate-600">{patient.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Allergies</p>
                  <p className="text-slate-600">{patient.allergies.join(', ')}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Emergency Contact</p>
                  <p className="text-slate-600">{patient.emergencyContact}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Metrics */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Health Metrics</h2>
            <div className="flex gap-2">
              <button className="bg-slate-100 border border-slate-200 px-3 py-1 rounded text-sm">
                View History
              </button>
              <button className="bg-slate-100 border border-slate-200 px-3 py-1 rounded text-sm">
                Sync Health Data
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded">
              <p className="font-semibold text-sky-600">Heart Rate</p>
              <p className="text-2xl font-bold my-1">{healthMetrics.heartRate.current} <span className="text-sm">bpm</span></p>
              <p className="text-xs text-slate-500">Range: {healthMetrics.heartRate.min}-{healthMetrics.heartRate.max} bpm</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded">
              <p className="font-semibold text-sky-600">Blood Pressure</p>
              <p className="text-2xl font-bold my-1">{healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}</p>
              <p className="text-xs text-slate-500">Last measured: {healthMetrics.bloodPressure.lastMeasured}</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded">
              <p className="font-semibold text-sky-600">Weight</p>
              <p className="text-2xl font-bold my-1">{healthMetrics.weight.current} <span className="text-sm">{healthMetrics.weight.unit}</span></p>
              <p className="text-xs text-slate-500">Last measured: {healthMetrics.weight.lastMeasured}</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded">
              <p className="font-semibold text-sky-600">Steps</p>
              <p className="text-2xl font-bold my-1">{healthMetrics.steps.today.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Goal: {healthMetrics.steps.goal.toLocaleString()} steps</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded">
              <p className="font-semibold text-sky-600">Sleep</p>
              <p className="text-2xl font-bold my-1">{healthMetrics.sleep.lastNight} <span className="text-sm">{healthMetrics.sleep.unit}</span></p>
              <p className="text-xs text-slate-500">Average: {healthMetrics.sleep.average} hours</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded flex items-center justify-center">
              <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded w-full">
                View All Metrics
              </button>
            </div>
          </div>
        </section>
        
        {/* Medical Records */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Medical Records</h2>
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded text-sm">
              Add New Record
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="p-3 border-b border-slate-200 text-sm font-semibold">Date</th>
                  <th className="p-3 border-b border-slate-200 text-sm font-semibold">Type</th>
                  <th className="p-3 border-b border-slate-200 text-sm font-semibold">Doctor</th>
                  <th className="p-3 border-b border-slate-200 text-sm font-semibold">Status</th>
                  <th className="p-3 border-b border-slate-200 text-sm font-semibold">Blockchain Verification</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="border-b border-slate-200">
                    <td className="p-3">{record.date}</td>
                    <td className="p-3">{record.type}</td>
                    <td className="p-3">{record.doctor}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        record.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {record.txHash ? (
                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Verify on Base
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        <footer className="text-center text-slate-500 text-sm border-t border-slate-200 pt-4">
          <p>© 2024 Medilocker - Secured by Base L2 and IPFS</p>
        </footer>
      </div>
    </div>
  );
} 