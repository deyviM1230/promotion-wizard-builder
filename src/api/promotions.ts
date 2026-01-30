import { api } from "./axios";

// 1. Interfaz para lo que RECIBES al listar (GET)
// Coincide con tu JSON: id, name, description, startDate, endDate, isActive
export interface PromotionListItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// 2. Interfaz para lo que ENVÍAS al crear (POST)
// Estructura anidada para conditions y actions
export interface CreatePromotionPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  condition: {
    conditionType: string;
    configuration: Record<string, any>;
  };
  action: {
    actionType: string;
    configuration: Record<string, any>;
  };
}

export const promotionApi = {
  // GET: Listar promociones (Devuelve la lista simple)
  getAll: async () => {
    const { data } = await api.get<PromotionListItem[]>("/promotions");
    return data;
  },

  // POST: Crear promoción (Envía la estructura compleja)
  create: async (payload: CreatePromotionPayload) => {
    // Asumimos que el backend devuelve la promoción creada (puede ser simple o completa)
    const { data } = await api.post<PromotionListItem>("/promotions", payload);
    return data;
  },
};