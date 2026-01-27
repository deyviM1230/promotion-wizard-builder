import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Calendar, Target, Gift, Sparkles } from "lucide-react";
import { useWizard } from "@/context/WizardContext";
import {
  getRuleTypeLabel,
  getRewardTypeLabel,
  getCategoryLabel,
  getCustomerTagLabel,
  getGiftProductLabel,
  PromotionFormData,
} from "@/lib/promotionSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Step4Summary() {
  const { formData, prevStep } = useWizard();

  const generateNaturalLanguageSummary = () => {
    const rules = formData.rules || [];
    const rewards = formData.rewards || [];

    if (rules.length === 0 || rewards.length === 0) {
      return "Configura las reglas y premios para ver el resumen";
    }

    const ruleDescriptions = rules.map((rule) => {
      if (rule.type === "minAmount") {
        return `Monto > $${rule.value}`;
      }
      if (rule.type === "category") {
        return `Categoría es ${getCategoryLabel(String(rule.value))}`;
      }
      if (rule.type === "customerTag") {
        return `Cliente es ${getCustomerTagLabel(String(rule.value))}`;
      }
      return String(rule.value);
    });

    const rewardDescriptions = rewards.map((reward) => {
      if (reward.type === "percentDiscount") {
        return `${reward.value}% de Descuento`;
      }
      if (reward.type === "fixedDiscount") {
        return `$${reward.value} de Descuento`;
      }
      if (reward.type === "freeProduct") {
        return `Regalo: ${getGiftProductLabel(String(reward.value))}`;
      }
      return String(reward.value);
    });

    const rulesText = ruleDescriptions.join(" ] Y [ ");
    const rewardsText = rewardDescriptions.join(" + ");

    return `SI [ ${rulesText} ], ENTONCES APLICAR [ ${rewardsText} ]`;
  };

  const generateFinalJSON = (): PromotionFormData => {
    return {
      name: formData.name || "",
      description: formData.description || "",
      priority: formData.priority || 5,
      dateRange: formData.dateRange as { from: Date; to: Date },
      activateImmediately: formData.activateImmediately || false,
      rules: formData.rules || [],
      rewards: formData.rewards || [],
    };
  };

  const handleCreate = () => {
    const finalData = generateFinalJSON();
    console.log("Promoción creada:", finalData);
    alert("¡Promoción creada exitosamente! Revisa la consola para ver el JSON.");
  };

  const jsonPreview = JSON.stringify(generateFinalJSON(), null, 2);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-dark">
          Revisar y Confirmar
        </h2>
        <p className="text-text-gray">
          Verifica los detalles de tu promoción antes de crearla
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* General Info Card */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-text-dark">
              <Calendar className="h-5 w-5 text-brand-teal" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-text-gray">Nombre:</span>
              <p className="font-medium text-text-dark">{formData.name || "-"}</p>
            </div>
            {formData.description && (
              <div>
                <span className="text-sm text-text-gray">Descripción:</span>
                <p className="text-text-dark text-sm">{formData.description}</p>
              </div>
            )}
            <div className="flex gap-4">
              <div>
                <span className="text-sm text-text-gray">Prioridad:</span>
                <Badge variant="secondary" className="ml-2">
                  {formData.priority}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-text-gray">Estado:</span>
                <Badge
                  variant={formData.activateImmediately ? "default" : "outline"}
                  className={formData.activateImmediately ? "ml-2 bg-brand-teal" : "ml-2"}
                >
                  {formData.activateImmediately ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </div>
            {formData.dateRange?.from && (
              <div>
                <span className="text-sm text-text-gray">Vigencia:</span>
                <p className="text-text-dark">
                  {format(formData.dateRange.from, "dd MMM yyyy", { locale: es })}
                  {formData.dateRange.to && ` - ${format(formData.dateRange.to, "dd MMM yyyy", { locale: es })}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rules Card */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-text-dark">
              <Target className="h-5 w-5 text-brand-teal" />
              Reglas ({formData.rules?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.rules?.map((rule, index) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-2 text-sm text-text-dark"
                >
                  <Check className="h-4 w-4 text-brand-teal" />
                  <span className="font-medium">{getRuleTypeLabel(rule.type)}:</span>
                  <span className="text-text-gray">
                    {rule.type === "category"
                      ? getCategoryLabel(String(rule.value))
                      : rule.type === "customerTag"
                      ? getCustomerTagLabel(String(rule.value))
                      : rule.type === "minAmount"
                      ? `$${rule.value}`
                      : rule.value}
                  </span>
                </div>
              ))}
              {(!formData.rules || formData.rules.length === 0) && (
                <p className="text-text-gray text-sm">No hay reglas configuradas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Card */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-text-dark">
            <Gift className="h-5 w-5 text-brand-orange" />
            Premios ({formData.rewards?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {formData.rewards?.map((reward) => (
              <Badge
                key={reward.id}
                variant="outline"
                className="px-3 py-1 border-brand-orange text-brand-orange"
              >
                {getRewardTypeLabel(reward.type)}:{" "}
                {reward.type === "percentDiscount"
                  ? `${reward.value}%`
                  : reward.type === "fixedDiscount"
                  ? `$${reward.value}`
                  : getGiftProductLabel(String(reward.value))}
              </Badge>
            ))}
            {(!formData.rewards || formData.rewards.length === 0) && (
              <p className="text-text-gray text-sm">No hay premios configurados</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Natural Language Summary */}
      <Card className="border-brand-teal/30 bg-brand-teal/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-text-dark">
            <Sparkles className="h-5 w-5 text-brand-teal" />
            Resumen de la Lógica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-dark font-medium leading-relaxed">
            {generateNaturalLanguageSummary()}
          </p>
        </CardContent>
      </Card>

      {/* JSON Preview */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-text-dark">
            Vista Previa JSON
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm text-text-dark font-mono">
            {jsonPreview}
          </pre>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          className="border-border text-text-dark hover:bg-secondary"
          onClick={prevStep}
        >
          Anterior
        </Button>
        <Button
          onClick={handleCreate}
          className="bg-brand-orange hover:bg-brand-orange-hover text-white font-medium px-8"
        >
          <Check className="mr-2 h-4 w-4" />
          Crear Promoción
        </Button>
      </div>
    </div>
  );
}
