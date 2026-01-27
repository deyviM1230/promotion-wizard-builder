import { z } from "zod";

// Rule Types
export const ruleTypes = [
  { value: "minAmount", label: "Monto Mínimo de Venta" },
  { value: "category", label: "Categoría Específica" },
  { value: "customerTag", label: "Etiqueta de Cliente" },
] as const;

export const categories = [
  { value: "dairy", label: "Lácteos" },
  { value: "beverages", label: "Bebidas" },
  { value: "snacks", label: "Snacks" },
  { value: "bakery", label: "Panadería" },
  { value: "frozen", label: "Congelados" },
] as const;

export const customerTags = [
  { value: "vip", label: "VIP" },
  { value: "new", label: "Nuevo" },
  { value: "frequent", label: "Frecuente" },
  { value: "wholesale", label: "Mayorista" },
] as const;

// Reward Types
export const rewardTypes = [
  { value: "percentDiscount", label: "Descuento Porcentual" },
  { value: "fixedDiscount", label: "Descuento Monto Fijo" },
  { value: "freeProduct", label: "Producto de Regalo" },
] as const;

export const giftProducts = [
  { value: "chocolate", label: "Barra de Chocolate" },
  { value: "water", label: "Agua Mineral 500ml" },
  { value: "chips", label: "Papas Fritas" },
  { value: "candy", label: "Bolsa de Caramelos" },
] as const;

// Rule Schema
const ruleSchema = z.object({
  id: z.string(),
  type: z.enum(["minAmount", "category", "customerTag"]),
  value: z.union([z.string(), z.number()]),
});

// Reward Schema
const rewardSchema = z.object({
  id: z.string(),
  type: z.enum(["percentDiscount", "fixedDiscount", "freeProduct"]),
  value: z.union([z.string(), z.number()]),
});

// Step 1: General Configuration Schema
export const step1Schema = z.object({
  name: z.string().min(1, "El nombre de la promoción es obligatorio"),
  description: z.string().optional(),
  priority: z.coerce.number().min(1, "Mínimo 1").max(10, "Máximo 10"),
  dateRange: z.object({
    from: z.date({ required_error: "Fecha inicio requerida" }),
    to: z.date({ required_error: "Fecha fin requerida" }).optional(),
  }).refine(data => !data.to || data.to > data.from, {
    message: "La fecha fin debe ser posterior a la fecha inicio",
    path: ["to"],
  }),
  activateImmediately: z.boolean().default(false),
});

// Step 2: Rules Schema
export const step2Schema = z.object({
  rules: z.array(ruleSchema).min(1, "Agrega al menos una regla"),
});

// Step 3: Rewards Schema
export const step3Schema = z.object({
  rewards: z.array(rewardSchema).min(1, "Agrega al menos un premio"),
});

// Complete Form Schema
export const promotionSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
});

export type Rule = z.infer<typeof ruleSchema>;
export type Reward = z.infer<typeof rewardSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type PromotionFormData = z.infer<typeof promotionSchema>;

// Helper to get readable labels
export const getRuleTypeLabel = (type: string) => 
  ruleTypes.find(r => r.value === type)?.label || type;

export const getRewardTypeLabel = (type: string) => 
  rewardTypes.find(r => r.value === type)?.label || type;

export const getCategoryLabel = (value: string) =>
  categories.find(c => c.value === value)?.label || value;

export const getCustomerTagLabel = (value: string) =>
  customerTags.find(c => c.value === value)?.label || value;

export const getGiftProductLabel = (value: string) =>
  giftProducts.find(p => p.value === value)?.label || value;
