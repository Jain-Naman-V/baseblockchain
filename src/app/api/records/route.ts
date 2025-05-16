import { NextResponse } from 'next/server';

// Mock database of medical records
const records = [
  { 
    id: 1, 
    date: "2023-10-15", 
    type: "Annual Physical", 
    doctor: "Dr. Smith", 
    status: "Completed",
    notes: "Patient is in good health. Recommended routine exercise and balanced diet.",
    attachments: ["lab_results.pdf", "vitals.pdf"]
  },
  { 
    id: 2, 
    date: "2023-09-02", 
    type: "Blood Test", 
    doctor: "Dr. Johnson", 
    status: "Completed",
    notes: "All blood markers within normal range. Slight elevation in cholesterol.",
    attachments: ["blood_test_results.pdf"]
  },
  { 
    id: 3, 
    date: "2023-07-18", 
    type: "MRI Scan", 
    doctor: "Dr. Patel", 
    status: "Completed",
    notes: "No abnormalities detected in brain scan. Follow-up not required.",
    attachments: ["mri_scan.jpg", "radiologist_report.pdf"]
  },
  { 
    id: 4, 
    date: "2023-11-30", 
    type: "Dental Checkup", 
    doctor: "Dr. Wilson", 
    status: "Scheduled",
    notes: "Routine dental examination and cleaning.",
    attachments: []
  }
];

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({ 
    success: true, 
    records,
    totalCount: records.length,
    blockchain: {
      network: "Base L2 Testnet",
      lastUpdated: new Date().toISOString(),
      blockNumber: 12345678
    }
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.type || !data.doctor) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }
    
    // Create new record (in a real app, this would store to a database and blockchain)
    const newRecord = {
      id: records.length + 1,
      date: data.date || new Date().toISOString().split('T')[0],
      type: data.type,
      doctor: data.doctor,
      status: data.status || "Scheduled",
      notes: data.notes || "",
      attachments: data.attachments || []
    };
    
    // Simulate adding to database
    records.push(newRecord);
    
    return NextResponse.json({
      success: true,
      record: newRecord,
      blockchain: {
        network: "Base L2 Testnet",
        transactionHash: "0x" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
        blockNumber: 12345678
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Invalid request data" 
    }, { status: 400 });
  }
} 