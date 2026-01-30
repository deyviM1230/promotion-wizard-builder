import { PromotionFormData } from "@/lib/promotionSchema";

// Tipos para el Payload del Backend
interface BackendPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  condition: {
    conditionType: string;
    configuration: any; // Es dinámico
  };
  action: {
    actionType: string;
    configuration: any; // Es dinámico
  };
}

export const mapFormDataToBackend = (formData: Partial<PromotionFormData>): BackendPayload => {
  // 1. Validaciones básicas
  if (!formData.rules?.[0] || !formData.rewards?.[0]) {
    throw new Error("La promoción debe tener al menos una regla y un premio.");
  }
  if (!formData.dateRange?.from) {
    throw new Error("La fecha de inicio es requerida.");
  }

  // Tomamos la PRIMERA regla y el PRIMER premio (según tus ejemplos el backend acepta 1 de cada uno)
  const rule = formData.rules[0];
  const reward = formData.rewards[0];

  // 2. Construir configuración de la CONDICIÓN (Regla)
  let conditionConfig = {};
  
  switch (rule.type) {
    case "TARGET_CATEGORY":
      conditionConfig = { categoryId: rule.value }; // El backend espera 'categoryId'
      break;
    case "MIN_AMOUNT":
      conditionConfig = { amount: Number(rule.value) }; // El backend espera 'amount' numérico
      break;
    // Aquí puedes agregar más casos futuros (ej: CUSTOMER_TAG)
    default:
      conditionConfig = { value: rule.value };
  }

  // 3. Construir configuración de la ACCIÓN (Premio)
  let actionConfig = {};

  switch (reward.type) {
    case "PERCENTAGE_DISCOUNT":
      actionConfig = { discountPercentage: Number(reward.value) }; // Espera 'discountPercentage'
      break;
    case "FIXED_DISCOUNT":
      actionConfig = { discountFixed: Number(reward.value) }; // Espera 'discountFixed'
      break;
    default:
      actionConfig = { value: reward.value };
  }

  // 4. Retornar el objeto final listo para Axios
  return {
    name: formData.name || "",
    description: formData.description || "",
    startDate: formData.dateRange.from.toISOString(), // Convertir Date a ISO String
    endDate: formData.dateRange.to 
      ? formData.dateRange.to.toISOString() 
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Default 1 año si no hay fin
    isActive: formData.activateImmediately || false,
    condition: {
      conditionType: rule.type,
      configuration: conditionConfig,
    },
    action: {
      actionType: reward.type,
      configuration: actionConfig,
    },
  };
};  