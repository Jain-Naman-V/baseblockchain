'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock patient data
  const [patient, setPatient] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1990-04-15",
    gender: "Male",
    bloodType: "O+",
    height: "185",
    weight: "70.5",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma", "Hypertension"],
    medications: ["Albuterol", "Lisinopril"],
    address: "123 Main St, Boston, MA",
    emergencyContact: "Jane Doe",
    emergencyPhone: "(555) 987-6543",
    emergencyRelation: "Spouse",
    medicalId: "MID-12345678",
    insuranceProvider: "HealthPlus",
    insurancePolicyNumber: "HPI-9876543",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(patient);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Handle edit form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle list items (allergies, conditions, medications)
  const handleListChange = (type, index, value) => {
    setFormData(prev => {
      const list = [...prev[type]];
      list[index] = value;
      return { ...prev, [type]: list };
    });
  };
  
  const addListItem = (type) => {
    setFormData(prev => {
      return { ...prev, [type]: [...prev[type], ''] };
    });
  };
  
  const removeListItem = (type, index) => {
    setFormData(prev => {
      const list = [...prev[type]];
      list.splice(index, 1);
      return { ...prev, [type]: list };
    });
  };
  
  // Save profile changes
  const saveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setPatient(formData);
      setIsEditing(false);
      setIsSaving(false);
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Profile updated successfully',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }, 1000);
  };
  
  // Format wallet address for display
  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Reset form if canceling edit
  useEffect(() => {
    if (!isEditing) {
      setFormData(patient);
    }
  }, [isEditing, patient]);
  
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#0284c7', marginBottom: '0.5rem' }}>Profile</h1>
          <p style={{ color: '#64748b' }}>Manage your personal information and access settings</p>
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

      {/* Notification */}
      {notification.show && (
        <div className={`mb-6 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        {!isEditing ? (
          /* View Mode */
          <div className="flex gap-8">
            <div className="shrink-0">
              <div className="w-32 h-32 rounded-full bg-slate-200 bg-cover bg-center border-4 border-sky-600" 
                   style={{ backgroundImage: `url('https://randomuser.me/api/portraits/men/44.jpg')` }}>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium">Connected with</p>
                <p className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded mt-1">
                  {formatAddress(patient.walletAddress)}
                </p>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="font-medium">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date of Birth</p>
                      <p className="font-medium">{patient.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Gender</p>
                      <p className="font-medium">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium">{patient.address}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">Blood Type</p>
                      <p className="font-medium">{patient.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Height (cm)</p>
                      <p className="font-medium">{patient.height}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Weight (kg)</p>
                      <p className="font-medium">{patient.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Allergies</p>
                      <p className="font-medium">{patient.allergies.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Medical Conditions</p>
                      <p className="font-medium">{patient.conditions.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Current Medications</p>
                      <p className="font-medium">{patient.medications.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="font-medium">{patient.emergencyContact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium">{patient.emergencyPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Relationship</p>
                    <p className="font-medium">{patient.emergencyRelation}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Medical ID</p>
                    <p className="font-medium">{patient.medicalId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Insurance Provider</p>
                    <p className="font-medium">{patient.insuranceProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Policy Number</p>
                    <p className="font-medium">{patient.insurancePolicyNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={saveChanges}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-200 bg-cover bg-center border-4 border-sky-600" 
                     style={{ backgroundImage: `url('https://randomuser.me/api/portraits/men/44.jpg')` }}>
                </div>
                <button type="button" className="mt-3 text-sm text-sky-600 hover:text-sky-800">
                  Change Photo
                </button>
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium">Connected with</p>
                  <p className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded mt-1">
                    {formatAddress(patient.walletAddress)}
                  </p>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-500">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500">Phone</label>
                        <input 
                          type="text" 
                          name="phone"
                          value={formData.phone} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500">Date of Birth</label>
                        <input 
                          type="date" 
                          name="dateOfBirth"
                          value={formData.dateOfBirth} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500">Gender</label>
                        <select 
                          name="gender"
                          value={formData.gender} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500">Address</label>
                        <input 
                          type="text" 
                          name="address"
                          value={formData.address} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-500">Blood Type</label>
                        <select 
                          name="bloodType"
                          value={formData.bloodType} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500">Height (cm)</label>
                        <input 
                          type="number" 
                          name="height"
                          value={formData.height} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500">Weight (kg)</label>
                        <input 
                          type="number" 
                          name="weight"
                          value={formData.weight} 
                          onChange={handleChange}
                          className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">Allergies</label>
                        {formData.allergies.map((allergy, index) => (
                          <div key={index} className="flex mb-2">
                            <input 
                              type="text" 
                              value={allergy} 
                              onChange={(e) => handleListChange('allergies', index, e.target.value)}
                              className="flex-1 p-2 border border-slate-300 rounded-lg" 
                            />
                            <button 
                              type="button"
                              onClick={() => removeListItem('allergies', index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => addListItem('allergies')}
                          className="text-sm text-sky-600 hover:text-sky-800"
                        >
                          + Add Allergy
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">Medical Conditions</label>
                        {formData.conditions.map((condition, index) => (
                          <div key={index} className="flex mb-2">
                            <input 
                              type="text" 
                              value={condition} 
                              onChange={(e) => handleListChange('conditions', index, e.target.value)}
                              className="flex-1 p-2 border border-slate-300 rounded-lg" 
                            />
                            <button 
                              type="button"
                              onClick={() => removeListItem('conditions', index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => addListItem('conditions')}
                          className="text-sm text-sky-600 hover:text-sky-800"
                        >
                          + Add Condition
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">Current Medications</label>
                        {formData.medications.map((medication, index) => (
                          <div key={index} className="flex mb-2">
                            <input 
                              type="text" 
                              value={medication} 
                              onChange={(e) => handleListChange('medications', index, e.target.value)}
                              className="flex-1 p-2 border border-slate-300 rounded-lg" 
                            />
                            <button 
                              type="button"
                              onClick={() => removeListItem('medications', index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => addListItem('medications')}
                          className="text-sm text-sky-600 hover:text-sky-800"
                        >
                          + Add Medication
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500">Name</label>
                      <input 
                        type="text" 
                        name="emergencyContact"
                        value={formData.emergencyContact} 
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500">Phone</label>
                      <input 
                        type="text" 
                        name="emergencyPhone"
                        value={formData.emergencyPhone} 
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500">Relationship</label>
                      <input 
                        type="text" 
                        name="emergencyRelation"
                        value={formData.emergencyRelation} 
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-500">Medical ID</label>
                      <input 
                        type="text" 
                        name="medicalId"
                        value={formData.medicalId} 
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500">Insurance Provider</label>
                      <input 
                        type="text" 
                        name="insuranceProvider"
                        value={formData.insuranceProvider} 
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500">Policy Number</label>
                      <input 
                        type="text" 
                        name="insurancePolicyNumber"
                        value={formData.insurancePolicyNumber} 
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-300 rounded-lg mt-1" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        <p>© 2023 Medilocker - Secured by Base L2 and IPFS</p>
      </footer>
    </div>
  );
} 