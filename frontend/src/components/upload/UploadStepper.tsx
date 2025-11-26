import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Eye, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

type Step = "upload" | "ocr" | "extract" | "save";

interface UploadStepperProps {
  currentStep: Step;
  onStepChange?: (step: Step) => void;
}

const steps: Array<{ key: Step; label: string; icon: typeof Upload }> = [
  { key: "upload", label: "Upload", icon: Upload },
  { key: "ocr", label: "OCR Processing", icon: FileText },
  { key: "extract", label: "Extract Data", icon: Eye },
  { key: "save", label: "Save Record", icon: CheckCircle2 },
];

const UploadStepper = ({ currentStep, onStepChange }: UploadStepperProps) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="medical-card p-8">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => onStepChange?.(step.key)}
                  disabled={isPending}
                  className={clsx(
                    "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                    isCompleted && "bg-success text-white border-success",
                    isActive && "bg-primary text-white border-primary scale-110",
                    isPending && "bg-background-light dark:bg-card-dark border-border-light dark:border-border-dark text-text-secondary"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </button>
                <span
                  className={clsx(
                    "mt-2 text-label font-medium",
                    isActive && "text-primary",
                    isCompleted && "text-success",
                    isPending && "text-text-secondary"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "flex-1 h-0.5 mx-4 transition-all duration-300",
                    isCompleted ? "bg-success" : "bg-border-light dark:bg-border-dark"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-body text-text-secondary">
            {currentStep === "upload" && "Upload your medical document to begin"}
            {currentStep === "ocr" && "Processing document with OCR technology..."}
            {currentStep === "extract" && "Extracting medical data from document..."}
            {currentStep === "save" && "Saving your medical record..."}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UploadStepper;

