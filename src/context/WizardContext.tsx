import React, { createContext, useContext, useState, useCallback } from "react";
import { PromotionFormData } from "@/lib/promotionSchema";

type WizardStep = 1 | 2 | 3 | 4;

interface WizardContextType {
  currentStep: WizardStep;
  formData: Partial<PromotionFormData>;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<PromotionFormData>) => void;
  canGoNext: boolean;
  setCanGoNext: (can: boolean) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialFormData: Partial<PromotionFormData> = {
  name: "",
  description: "",
  priority: 5,
  dateRange: undefined,
  activateImmediately: false,
  rules: [],
  rewards: [],
};

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<Partial<PromotionFormData>>(initialFormData);
  const [canGoNext, setCanGoNext] = useState(false);

  const setStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4) as WizardStep);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);
  }, []);

  const updateFormData = useCallback((data: Partial<PromotionFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        formData,
        setStep,
        nextStep,
        prevStep,
        updateFormData,
        canGoNext,
        setCanGoNext,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
