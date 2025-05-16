'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { showToast } from '../../utils/animations';

export default function RecordsPage() {
  // Mock records data
  const [records, setRecords] = useState([
    { 
      id: 1, 
      date: "2024-06-15", 
      type: "Annual Physical", 
      doctor: "Dr. Smith", 
      facility: "General Hospital",
      status: "Completed", 
      txHash: "0x1234567890abcdef1234567890abcdef12345678" 
    },
    { 
      id: 2, 
      date: "2024-05-02", 
      type: "Blood Test", 
      doctor: "Dr. Johnson", 
      facility: "Medical Lab Inc.",
      status: "Completed", 
      txHash: "0xabcdef1234567890abcdef1234567890abcdef12" 
    },
    { 
      id: 3, 
      date: "2024-03-18", 
      type: "MRI Scan", 
      doctor: "Dr. Patel", 
      facility: "Imaging Center",
      status: "Completed", 
      txHash: "0x9876543210abcdef1234567890abcdef12345678" 
    },
    { 
      id: 4, 
      date: "2024-06-30", 
      type: "Dental Checkup", 
      doctor: "Dr. Wilson", 
      facility: "Smile Dental Clinic",
      status: "Scheduled" 
    },
    { 
      id: 5, 
      date: "2024-02-10", 
      type: "Vaccination", 
      doctor: "Dr. Garcia", 
      facility: "Community Health Center",
      status: "Completed", 
      txHash: "0x5678901234abcdef5678901234abcdef56789012" 
    }
  ]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  
  // Animation effect when the component mounts
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtered records
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.facility.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      record.status.toLowerCase() === statusFilter.toLowerCase();
      
    return matchesSearch && matchesStatus;
  });
  
  // Handle download record
  const handleDownload = (id: number) => {
    showToast('Record downloaded successfully', 'success');
  };
  
  // Handle view verification
  const handleVerification = (txHash: string) => {
    window.open(`https://basescan.org/tx/${txHash}`, '_blank');
  };
  
  // Handle share record
  const handleShare = (id: number) => {
    showToast('Record sharing dialog opened', 'info');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading your records...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sky-600 animate-slide-in-left">Medical Records</h1>
          <Link 
            href="/records/new" 
            className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-6 rounded-lg button-enhanced animate-slide-in-right"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Record
            </span>
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 card-enhanced animate-slide-in-left" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search records..."
                className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:border-sky-500 focus:ring focus:ring-sky-200 focus:ring-opacity-50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <div>
              <select 
                className="p-3 pr-10 border border-slate-300 rounded-lg bg-white focus:border-sky-500 focus:ring focus:ring-sky-200 focus:ring-opacity-50 transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div className="hidden md:block bg-blue-50 rounded-lg px-4 py-2 text-sm text-blue-700">
              <span className="font-medium">{filteredRecords.length}</span> records found
            </div>
          </div>
        </div>
        
        {/* Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden card-enhanced animate-slide-in-left" style={{ animationDelay: '200ms' }}>
          {filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="p-4 border-b border-slate-200 text-sm font-semibold">Date</th>
                    <th className="p-4 border-b border-slate-200 text-sm font-semibold">Type</th>
                    <th className="p-4 border-b border-slate-200 text-sm font-semibold">Doctor</th>
                    <th className="p-4 border-b border-slate-200 text-sm font-semibold">Facility</th>
                    <th className="p-4 border-b border-slate-200 text-sm font-semibold">Status</th>
                    <th className="p-4 border-b border-slate-200 text-sm font-semibold">Verification</th>
                    <th className="p-4 border-b border-slate-200 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${activeRow === record.id ? 'bg-blue-50' : ''}`}
                      onMouseEnter={() => setActiveRow(record.id)}
                      onMouseLeave={() => setActiveRow(null)}
                      style={{ animationDelay: `${300 + index * 50}ms` }}
                      data-animate="true"
                      data-animation="animate-fade-in"
                    >
                      <td className="p-4">{record.date}</td>
                      <td className="p-4">{record.type}</td>
                      <td className="p-4">{record.doctor}</td>
                      <td className="p-4">{record.facility}</td>
                      <td className="p-4">
                        <span className={`badge-enhanced ${
                          record.status === 'Completed' ? 'success' : 'warning'
                        }`}>
                          {record.status === 'Completed' && (
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {record.status === 'Scheduled' && (
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {record.txHash ? (
                          <button 
                            onClick={() => handleVerification(record.txHash!)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center hover-glow px-2 py-1 rounded transition-all"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Verify on Base
                          </button>
                        ) : (
                          <span className="text-slate-400 text-sm">Pending</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/records/${record.id}`} 
                            className="text-sky-600 hover:text-sky-800 hover:bg-sky-50 p-1.5 rounded-full transition-all"
                            title="View Record"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button 
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 p-1.5 rounded-full transition-all"
                            onClick={() => handleDownload(record.id)}
                            title="Download Record"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button 
                            className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 p-1.5 rounded-full transition-all"
                            onClick={() => handleShare(record.id)}
                            title="Share Record"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg 
                className="w-16 h-16 mx-auto text-slate-300 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <p className="text-slate-500 mb-3">No records found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-sky-600 hover:text-sky-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm text-sm text-slate-500 flex flex-wrap gap-4 animate-slide-in-left" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-100 border border-green-400 mr-2"></span>
            <span>Completed records</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-400 mr-2"></span>
            <span>Scheduled appointments</span>
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Blockchain verified</span>
          </div>
        </div>
      </div>
    </div>
  );
} 