/**
 * Dummy Data Seeding Script for Scan Sehat
 * 
 * This script creates:
 * - A dummy user (Rakesh Kumar)
 * - Dummy medical records with structured AI data
 * - Dummy access logs
 * 
 * Usage: ts-node src/scripts/seedDummyData.ts
 */

import mongoose from "mongoose";
import { config } from "../config";
import { User } from "../models/User";
import { MedicalRecord, StructuredMedicalData } from "../models/MedicalRecord";
import { AccessLog } from "../models/AccessLog";
import { Tenant } from "../models/Tenant";
import bcrypt from "bcryptjs";

/**
 * Creates dummy data for development/testing
 */
const seedDummyData = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");

    // Create or get a tenant
    let tenant = await Tenant.findOne({ slug: "dummy-tenant" });
    if (!tenant) {
      tenant = await Tenant.create({
        name: "Dummy Tenant",
        slug: "dummy-tenant",
        primaryContact: "Rakesh Kumar",
        contactEmail: "rakesh@example.com",
        plan: "free",
        status: "active"
      });
      console.log("Created dummy tenant");
    }

    // Create dummy user
    const hashedPassword = await bcrypt.hash("password123", 10);
    let dummyUser = await User.findOne({ email: "rakesh@example.com" });
    
    if (dummyUser) {
      console.log("Dummy user already exists, updating...");
      dummyUser.name = "Rakesh Kumar";
      dummyUser.phone = "+91 9876543210";
      dummyUser.emailVerified = true;
      await dummyUser.save();
    } else {
      dummyUser = await User.create({
        name: "Rakesh Kumar",
        email: "rakesh@example.com",
        phone: "+91 9876543210",
        password: hashedPassword,
        role: "patient",
        tenant: tenant._id,
        emailVerified: true
      });
      console.log("Created dummy user: Rakesh Kumar");
    }

    // Create dummy medical records
    const record1Data: StructuredMedicalData = {
      diagnosis: "Mild Anemia",
      medications: ["Iron Supplement - Ferrous Sulfate 325mg"],
      labValues: {
        hb: "10.5 g/dL",
        wbc: "7000/mm3"
      },
      vitals: {},
      doctorNotes: "Patient shows signs of mild anemia. Recommend iron supplements and follow-up in 3 months.",
      allergies: [],
      recordType: "Blood Test Report"
    };

    const record2Data: StructuredMedicalData = {
      diagnosis: "Hypertension",
      medications: ["Amlodipine 5mg", "Lisinopril 10mg"],
      labValues: {},
      vitals: {
        bp: "140/90 mmHg",
        pulse: "78 bpm"
      },
      doctorNotes: "Take medication after lunch. Monitor blood pressure daily.",
      allergies: [],
      doctorName: "Dr. Amit Sharma",
      recordType: "Prescription"
    };

    // Check if records already exist
    const existingRecords = await MedicalRecord.find({ patient: dummyUser._id });
    
    if (existingRecords.length === 0) {
      // Record 1: Blood Test Report
      const record1 = await MedicalRecord.create({
        tenant: tenant._id,
        patient: dummyUser._id,
        uploader: dummyUser._id,
        fileUrl: "https://via.placeholder.com/800x1000/0C6CF2/FFFFFF?text=Blood+Test+Report",
        fileType: "image/png",
        fileSize: 102400,
        encryption: {
          ciphertext: "dummy-ciphertext-1",
          iv: "dummy-iv-1",
          salt: "dummy-salt-1"
        },
        summary: "Blood test report showing mild anemia with hemoglobin at 10.5 g/dL. White blood cell count normal at 7000/mm3. Iron supplementation recommended.",
        metadata: {
          reportDate: "2025-01-05",
          labName: "City Lab Diagnostics"
        },
        ocrText: "BLOOD TEST REPORT\nPatient: Rakesh Kumar\nDate: 2025-01-05\nHemoglobin: 10.5 g/dL\nWBC: 7000/mm3\nDiagnosis: Mild Anemia",
        embedding: [],
        tags: ["blood-test", "anemia", "lab-report"],
        integrity: "patient-uploaded",
        structuredData: record1Data
      });
      console.log("Created Record 1: Blood Test Report");

      // Record 2: Prescription
      const record2 = await MedicalRecord.create({
        tenant: tenant._id,
        patient: dummyUser._id,
        uploader: dummyUser._id,
        fileUrl: "https://via.placeholder.com/800x1000/00A1A9/FFFFFF?text=Prescription",
        fileType: "image/png",
        fileSize: 98304,
        encryption: {
          ciphertext: "dummy-ciphertext-2",
          iv: "dummy-iv-2",
          salt: "dummy-salt-2"
        },
        summary: "Prescription from Dr. Amit Sharma for hypertension management. Medications: Amlodipine 5mg and Lisinopril 10mg. Take after lunch.",
        metadata: {
          prescriptionDate: "2025-01-08",
          doctorName: "Dr. Amit Sharma"
        },
        ocrText: "PRESCRIPTION\nPatient: Rakesh Kumar\nDoctor: Dr. Amit Sharma\nDate: 2025-01-08\nMedications:\n- Amlodipine 5mg\n- Lisinopril 10mg\nInstructions: Take after lunch",
        embedding: [],
        tags: ["prescription", "hypertension"],
        integrity: "patient-uploaded",
        structuredData: record2Data
      });
      console.log("Created Record 2: Prescription");
    } else {
      console.log("Medical records already exist, skipping...");
    }

    // Create dummy access log
    const existingLogs = await AccessLog.find({ patient: dummyUser._id });
    if (existingLogs.length === 0) {
      await AccessLog.create({
        tenant: tenant._id,
        patient: dummyUser._id,
        doctorEmail: "dr.meenakshi.rao@example.com",
        action: "RECORDS_VIEWED",
        details: {
          doctorName: "Dr. Meenakshi Rao",
          accessedFiles: 2,
          mode: "read-only",
          accessedAt: "2025-01-10T12:41:22Z"
        }
      });
      console.log("Created dummy access log");
    } else {
      console.log("Access logs already exist, skipping...");
    }

    console.log("\n✅ Dummy data seeding completed successfully!");
    console.log("\nLogin credentials:");
    console.log("Email: rakesh@example.com");
    console.log("Password: password123");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDummyData();

