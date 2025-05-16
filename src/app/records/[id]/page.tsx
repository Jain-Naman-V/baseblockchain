'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface RecordAttachment {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

interface MedicalRecord {
  id: number;
  title: string;
  date: string;
  provider: string;
  doctor: string;
  recordType: string;
  status: string;
  notes: string;
  diagnosis: string[];
  prescriptions: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    notes: string;
  }[];
  attachments: RecordAttachment[];
  blockchain: {
    hash: string;
    timestamp: string;
    blockNumber: number;
    network: string;
  };
}

export default function RecordDetail() {
  const params = useParams();
  const recordId = params.id;
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    // Simulate API call to fetch record
    setTimeout(() => {
      // Mock data for the medical record
      setRecord({
        id: parseInt(recordId as string),
        title: "Annual Physical Examination",
        date: "2023-10-15",
        provider: "Mercy Medical Center",
        doctor: "Dr. Sarah Johnson",
        recordType: "Examination",
        status: "Completed",
        notes: "Patient presents in good overall health. Blood pressure slightly elevated, recommend diet modification and follow-up in 3 months. Routine blood work shows all markers within normal range.",
        diagnosis: ["Essential hypertension", "Seasonal allergies"],
        prescriptions: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: "2023-10-15",
            endDate: "2024-04-15",
            notes: "Take in the morning with food."
          },
          {
            name: "Loratadine",
            dosage: "10mg",
            frequency: "Once daily as needed",
            startDate: "2023-10-15",
            endDate: "2024-01-15",
            notes: "Take for allergy symptoms."
          }
        ],
        attachments: [
          {
            id: 1,
            name: "Blood Test Results.pdf",
            type: "PDF",
            uploadDate: "2023-10-15",
            size: "1.2 MB"
          },
          {
            id: 2,
            name: "EKG Reading.pdf",
            type: "PDF",
            uploadDate: "2023-10-15",
            size: "845 KB"
          },
          {
            id: 3,
            name: "Doctor Notes.docx",
            type: "DOCX",
            uploadDate: "2023-10-15",
            size: "350 KB"
          }
        ],
        blockchain: {
          hash: "0x3d8e3f7c8a9b2d1e5f4c7b6a9d8c3b2a1e0f9d8c7b6a5f4e3d2c1b0a9e8d7f6e5",
          timestamp: "2023-10-15T14:30:45Z",
          blockNumber: 12345678,
          network: "Base Testnet"
        }
      });
      setIsLoading(false);
    }, 1000);
  }, [recordId]);

  if (isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        <p>Loading medical record...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ 
        padding: '2rem', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        <h2>Record not found</h2>
        <p>The medical record you are looking for could not be found.</p>
        <Link href="/" style={{ color: '#0284c7', textDecoration: 'none' }}>Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#0284c7', marginBottom: '0.5rem' }}>Medical Record</h1>
          <p style={{ color: '#64748b' }}>{record.title} - {record.date}</p>
        </div>
        <Link href="/" style={{ 
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          padding: '0.75rem 1.5rem', 
          borderRadius: '0.5rem',
          textDecoration: 'none',
          color: '#0f172a',
          display: 'inline-block'
        }}>
          Back to Dashboard
        </Link>
      </header>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.75rem', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Status Badge */}
        <div style={{ 
          position: 'absolute', 
          top: '0', 
          right: '0', 
          backgroundColor: record.status === 'Completed' ? '#dcfce7' : '#fee2e2',
          color: record.status === 'Completed' ? '#166534' : '#991b1b',
          padding: '0.25rem 1.5rem',
          transform: 'rotate(45deg) translateX(30px) translateY(-20px)',
          transformOrigin: 'center',
          width: '150px',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {record.status}
        </div>
        
        {/* Record Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e2e8f0', 
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem'
        }}>
          <button 
            onClick={() => setActiveTab('details')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeTab === 'details' ? '#e2e8f0' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: activeTab === 'details' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Details
          </button>
          <button 
            onClick={() => setActiveTab('prescriptions')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeTab === 'prescriptions' ? '#e2e8f0' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: activeTab === 'prescriptions' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Prescriptions
          </button>
          <button 
            onClick={() => setActiveTab('attachments')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeTab === 'attachments' ? '#e2e8f0' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: activeTab === 'attachments' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Attachments
          </button>
          <button 
            onClick={() => setActiveTab('blockchain')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeTab === 'blockchain' ? '#e2e8f0' : 'transparent',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: activeTab === 'blockchain' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Blockchain
          </button>
        </div>

        {/* Record Content - Details Tab */}
        {activeTab === 'details' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Medical Provider</p>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>{record.provider}</p>
              </div>
              <div>
                <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Doctor</p>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>{record.doctor}</p>
              </div>
              <div>
                <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Date</p>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>{record.date}</p>
              </div>
              <div>
                <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Record Type</p>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>{record.recordType}</p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Diagnosis</p>
              <ul style={{ 
                margin: '0', 
                padding: '0.5rem 0 0.5rem 1.5rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0' 
              }}>
                {record.diagnosis.map((diagnosis, index) => (
                  <li key={index} style={{ margin: '0.5rem 0' }}>{diagnosis}</li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Notes</p>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                lineHeight: '1.6'
              }}>
                {record.notes}
              </div>
            </div>
          </div>
        )}

        {/* Record Content - Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', marginTop: '0', marginBottom: '1.5rem' }}>Prescribed Medications</h3>
            
            {record.prescriptions.length === 0 ? (
              <p>No prescriptions for this visit.</p>
            ) : (
              record.prescriptions.map((prescription, index) => (
                <div 
                  key={index}
                  style={{ 
                    marginBottom: '1.5rem', 
                    padding: '1rem', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: '0', color: '#0284c7' }}>{prescription.name}</h4>
                    <span style={{ fontWeight: 'bold' }}>{prescription.dosage}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Frequency</p>
                      <p style={{ margin: '0', fontSize: '0.875rem' }}>{prescription.frequency}</p>
                    </div>
                    <div>
                      <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Duration</p>
                      <p style={{ margin: '0', fontSize: '0.875rem' }}>{prescription.startDate} to {prescription.endDate}</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Instructions</p>
                    <p style={{ margin: '0', fontSize: '0.875rem' }}>{prescription.notes}</p>
                  </div>
                </div>
              ))
            )}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button style={{ 
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}>
                Print Prescriptions
              </button>
              <button style={{ 
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}>
                Request Refill
              </button>
            </div>
          </div>
        )}

        {/* Record Content - Attachments Tab */}
        {activeTab === 'attachments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: '0' }}>Document Attachments</h3>
              <button style={{ 
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}>
                Upload New
              </button>
            </div>
            
            {record.attachments.length === 0 ? (
              <p>No attachments for this record.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {record.attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    style={{ 
                      padding: '1rem', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#e2e8f0', 
                        borderRadius: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#64748b',
                        marginRight: '1rem'
                      }}>
                        {attachment.type}
                      </div>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>{attachment.name}</p>
                        <p style={{ margin: '0', fontSize: '0.875rem', color: '#64748b' }}>
                          Uploaded: {attachment.uploadDate} • {attachment.size}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button style={{ 
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#0284c7',
                        cursor: 'pointer',
                        marginRight: '1rem',
                        textDecoration: 'underline'
                      }}>
                        View
                      </button>
                      <button style={{ 
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#0284c7',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Record Content - Blockchain Tab */}
        {activeTab === 'blockchain' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', marginTop: '0', marginBottom: '1.5rem' }}>Blockchain Verification</h3>
            
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ 
                display: 'inline-block',
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                Verified on Blockchain
              </div>
              <p style={{ color: '#64748b', margin: '0' }}>
                This medical record has been cryptographically secured on the blockchain.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Transaction Hash</p>
                <p style={{ 
                  margin: '0.25rem 0 0 0', 
                  wordBreak: 'break-all', 
                  fontFamily: 'monospace',
                  backgroundColor: '#e2e8f0',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}>
                  {record.blockchain.hash}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Timestamp</p>
                  <p style={{ margin: '0.25rem 0 0 0' }}>
                    {new Date(record.blockchain.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Block Number</p>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{record.blockchain.blockNumber}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', margin: '0', fontSize: '0.875rem', color: '#64748b' }}>Network</p>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{record.blockchain.network}</p>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button style={{ 
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}>
                Verify Authenticity
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.75rem', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>Share this Record</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              Share with Doctor
            </button>
            <button style={{ 
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              Generate Link
            </button>
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>Record Actions</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              Print Record
            </button>
            <button style={{ 
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
              Request Deletion
            </button>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        <p>© 2023 Medilocker - Secured by Base L2 and IPFS</p>
      </footer>
    </div>
  );
} 