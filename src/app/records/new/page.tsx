'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddRecordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordData, setRecordData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    provider: '',
    doctor: '',
    recordType: 'Examination',
    status: 'Completed',
    notes: '',
    diagnosis: [''],
    attachments: []
  });

  const recordTypes = [
    'Examination', 'Lab Result', 'Vaccination', 'Prescription', 
    'Surgery', 'Imaging', 'Procedure', 'Consultation', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedDiagnosis = [...recordData.diagnosis];
    updatedDiagnosis[index] = e.target.value;
    setRecordData(prev => ({
      ...prev,
      diagnosis: updatedDiagnosis
    }));
  };
  
  const addDiagnosisField = () => {
    setRecordData(prev => ({
      ...prev,
      diagnosis: [...prev.diagnosis, '']
    }));
  };
  
  const removeDiagnosisField = (index: number) => {
    const updatedDiagnosis = [...recordData.diagnosis];
    updatedDiagnosis.splice(index, 1);
    setRecordData(prev => ({
      ...prev,
      diagnosis: updatedDiagnosis
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle file uploads
    const files = e.target.files;
    if (!files) return;
    
    // Just for mock purposes
    const fileList = Array.from(files).map(file => ({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
    }));
    
    setRecordData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileList]
    }));
  };
  
  const removeAttachment = (index: number) => {
    const updatedAttachments = [...recordData.attachments];
    updatedAttachments.splice(index, 1);
    setRecordData(prev => ({
      ...prev,
      attachments: updatedAttachments
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Remove any empty diagnosis entries
      const cleanedData = {
        ...recordData,
        diagnosis: recordData.diagnosis.filter(d => d.trim() !== '')
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would:
      // 1. Upload attachments to IPFS
      // 2. Create record on blockchain
      // 3. Store record in database
      console.log('Record created:', cleanedData);
      
      // Redirect to records page
      router.push('/records');
    } catch (error) {
      console.error('Error creating record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#0284c7', marginBottom: '0.5rem' }}>Add New Medical Record</h1>
        <p style={{ color: '#64748b' }}>Create a new medical record to store in your secure vault</p>
      </header>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Record Title*
            </label>
            <input 
              type="text" 
              name="title" 
              value={recordData.title} 
              onChange={handleInputChange}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #cbd5e1',
                fontSize: '1rem'
              }}
              placeholder="e.g., Annual Physical Examination"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Date*
              </label>
              <input 
                type="date" 
                name="date" 
                value={recordData.date} 
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Record Type*
              </label>
              <select 
                name="recordType" 
                value={recordData.recordType} 
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                {recordTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Healthcare Provider*
              </label>
              <input 
                type="text" 
                name="provider" 
                value={recordData.provider} 
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem'
                }}
                placeholder="e.g., Mercy Medical Center"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Doctor*
              </label>
              <input 
                type="text" 
                name="doctor" 
                value={recordData.doctor} 
                onChange={handleInputChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem'
                }}
                placeholder="e.g., Dr. Sarah Johnson"
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Diagnosis
            </label>
            
            {recordData.diagnosis.map((diagnosis, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" 
                  value={diagnosis} 
                  onChange={(e) => handleDiagnosisChange(e, index)}
                  style={{ 
                    flex: 1,
                    padding: '0.75rem', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem'
                  }}
                  placeholder="e.g., Essential hypertension"
                />
                
                <button 
                  type="button" 
                  onClick={() => removeDiagnosisField(index)}
                  style={{ 
                    padding: '0.5rem', 
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f1f5f9',
                    cursor: 'pointer'
                  }}
                  disabled={recordData.diagnosis.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={addDiagnosisField}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f1f5f9',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              + Add Another Diagnosis
            </button>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Notes
            </label>
            <textarea 
              name="notes" 
              value={recordData.notes} 
              onChange={handleInputChange}
              rows={4}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #cbd5e1',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Enter any additional details about this medical record"
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Attachments
            </label>
            
            <div style={{ 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              border: '2px dashed #cbd5e1',
              backgroundColor: '#f8fafc',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <input 
                type="file" 
                id="file-upload"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="file-upload"
                style={{ 
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#0284c7',
                  color: 'white',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'inline-block'
                }}
              >
                Select Files
              </label>
              <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
                or drag and drop files here
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Supports PDF, JPEG, PNG, DOCX (max 10MB each)
              </p>
            </div>
            
            {recordData.attachments.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {recordData.attachments.length} file(s) selected
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {recordData.attachments.map((file, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '0.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          backgroundColor: '#e2e8f0',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          {file.type}
                        </div>
                        <span>{file.name}</span>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                          ({file.size})
                        </span>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => removeAttachment(index)}
                        style={{ 
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          textDecoration: 'underline'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem'
          }}>
            <Link 
              href="/records"
              style={{ 
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '1rem'
              }}
            >
              Cancel
            </Link>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ 
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
      
      <div style={{ padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem' }}>
        <h3 style={{ color: '#0284c7', marginTop: 0 }}>Data Security</h3>
        <p>
          Your medical records are encrypted and stored on IPFS. Only cryptographic hashes are stored on the blockchain, 
          ensuring your data remains private and secure. You control who has access to your records.
        </p>
      </div>
    </div>
  );
} 