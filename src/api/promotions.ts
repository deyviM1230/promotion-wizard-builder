import type {
	PromotionBackendDTO,
	PromotionFormData,
} from "../lib/promotionSchema";
import { api } from "./axios";
export const promotionApi = {
	// Obtener todas
	getAll: async () => {
		// 1. Hacemos la petición a '/promotions'
		const { data } = await api.get<PromotionBackendDTO[]>("/promotions");
		return data;
	},

	// Obtener una por ID
	getById: async (id: string) => {
		const { data } = await api.get<PromotionFormData>(`/promotions/${id}`);
		return data;
	},

	// Crear
	create: async (promo: PromotionFormData) => {
		const { data } = await api.post<PromotionFormData>("/promotions", promo);
		return data;
	},

	// Actualizar
	update: async (id: string, promo: Partial<PromotionFormData>) => {
		const { data } = await api.put<PromotionFormData>(
			`/promotions/${id}`,
			promo,
		);
		return data;
	},

	// Eliminar
	delete: async (id: string) => {
		await api.delete(`/promotions/${id}`);
	},
};
