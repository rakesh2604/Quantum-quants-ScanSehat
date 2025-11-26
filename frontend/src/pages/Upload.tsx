import { useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle2, X } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import UploadStepper from "../components/upload/UploadStepper";
import { useToast } from "../components/Toast";
import { recordApi } from "../utils/api";

type Step = "upload" | "ocr" | "extract" | "save";

const Upload = () => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const toast = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
        toast("Please upload a PDF or image file", "error");
        return;
      }
      setSelectedFile(file);
      setCurrentStep("ocr");
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    try {
      // Simulate OCR processing
      setCurrentStep("ocr");
      setUploadProgress(30);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setCurrentStep("extract");
      setUploadProgress(60);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock extracted data
      setExtractedData({
        patientName: "John Doe",
        dateOfBirth: "1990-01-15",
        diagnosis: "Hypertension",
        medications: ["Lisinopril 10mg"],
        doctor: "Dr. Smith",
      });
      
      setCurrentStep("save");
      setUploadProgress(100);
      
      // Save record
      const formData = new FormData();
      formData.append("file", file);
      
      await recordApi.upload(formData);
      
      toast("Medical record uploaded successfully", "success");
      
      // Reset after delay
      setTimeout(() => {
        setCurrentStep("upload");
        setSelectedFile(null);
        setUploadProgress(0);
        setExtractedData(null);
      }, 2000);
    } catch (error: any) {
      toast(error?.response?.data?.message ?? "Failed to process file", "error");
      setCurrentStep("upload");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-title-lg text-text-dark dark:text-text-light font-bold mb-2">
            Upload Medical Record
          </h1>
          <p className="text-body text-text-secondary">
            Upload your medical documents and we'll extract the information automatically
          </p>
        </motion.div>

        {/* Upload Stepper */}
        <UploadStepper currentStep={currentStep} />

        {/* Upload Zone */}
        {currentStep === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-12 hover:shadow-xl transition-all"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-[#0C6CF2] hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-teal-50/50 transition-all cursor-pointer"
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0C6CF2] to-[#00A1A9] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <UploadIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Drop your file here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Supports PDF and image files (JPG, PNG)
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-[#0C6CF2] to-[#00A1A9] hover:from-[#0A5CD9] hover:to-[#009199] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                  Select File
                </button>
              </label>
            </div>
          </motion.div>
        )}

        {/* Processing States */}
        {currentStep !== "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="medical-card p-8 space-y-6"
          >
            {selectedFile && (
              <div className="flex items-center gap-4 p-4 bg-background-light dark:bg-card-dark rounded-lg">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="text-body font-medium text-text-dark dark:text-text-light">
                    {selectedFile.name}
                  </p>
                  <p className="text-label text-text-secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentStep("upload");
                    setSelectedFile(null);
                    setUploadProgress(0);
                  }}
                  className="p-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary/10"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            )}

            {/* Progress Bar */}
            {currentStep !== "save" && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-label text-text-secondary">Processing...</span>
                  <span className="text-label text-text-secondary">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-background-light dark:bg-card-dark rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Extracted Data Preview */}
            {extractedData && currentStep === "save" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-success-light rounded-lg space-y-3"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <h3 className="text-section-header text-success font-semibold">
                    Data Extracted Successfully
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-label text-text-secondary mb-1">Patient Name</p>
                    <p className="text-body text-text-dark dark:text-text-light font-medium">
                      {extractedData.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-label text-text-secondary mb-1">Date of Birth</p>
                    <p className="text-body text-text-dark dark:text-text-light font-medium">
                      {extractedData.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p className="text-label text-text-secondary mb-1">Diagnosis</p>
                    <p className="text-body text-text-dark dark:text-text-light font-medium">
                      {extractedData.diagnosis}
                    </p>
                  </div>
                  <div>
                    <p className="text-label text-text-secondary mb-1">Doctor</p>
                    <p className="text-body text-text-dark dark:text-text-light font-medium">
                      {extractedData.doctor}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Upload;

