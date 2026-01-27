import { WizardProvider, useWizard } from "@/context/WizardContext";
import { WizardProgress } from "./WizardProgress";
import { Step1GeneralConfig } from "./Step1GeneralConfig";
import { Step2Rules } from "./Step2Rules";
import { Step3Rewards } from "./Step3Rewards";
import { Step4Summary } from "./Step4Summary";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

function WizardContent() {
  const { currentStep } = useWizard();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-brand-teal/10">
              <Sparkles className="h-6 w-6 text-brand-teal" />
            </div>
            <h1 className="text-3xl font-bold text-text-dark">
              Motor de Promociones
            </h1>
          </div>
          <p className="text-text-gray">
            Crea promociones inteligentes para tu minimarket
          </p>
        </div>

        {/* Progress Bar */}
        <WizardProgress />

        {/* Step Content */}
        <Card className="mt-8 border-border shadow-sm">
          <CardContent className="p-6 md:p-8">
            {currentStep === 1 && <Step1GeneralConfig />}
            {currentStep === 2 && <Step2Rules />}
            {currentStep === 3 && <Step3Rewards />}
            {currentStep === 4 && <Step4Summary />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function PromotionWizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
