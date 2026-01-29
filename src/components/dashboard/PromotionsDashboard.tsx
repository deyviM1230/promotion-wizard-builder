import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDeletePromotion, usePromotions } from "@/hooks/usePromotions";
import type { PromotionBackendDTO } from "@/lib/promotionSchema";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardToolbar } from "./DashboardToolbar";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { PromotionsTable } from "./PromotionsTable";

interface PromotionsDashboardProps {
	onNewPromotion: () => void;
}

export const PromotionsDashboard = ({
	onNewPromotion,
}: PromotionsDashboardProps) => {
	const navigate = useNavigate();

	// HOOKS: Datos del servidor
	const { data: promotions, isLoading, isError } = usePromotions();
	const deleteMutation = useDeletePromotion();

	// ESTADO: UI Local
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [promotionToDelete, setPromotionToDelete] =
		useState<PromotionBackendDTO | null>(null);

	// LÓGICA: Filtrado
	const filteredPromotions = useMemo(() => {
		const data = promotions || []; // Protección contra undefined

		return data.filter((promo) => {
			// Filtro de Búsqueda
			const matchesSearch = promo.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			// Filtro de Estado (Usando isActive del backend)
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && promo.isActive === true) ||
				(statusFilter === "inactive" && promo.isActive === false);

			return matchesSearch && matchesStatus;
		});
	}, [promotions, searchQuery, statusFilter]);

	// ACCIONES
	const handleToggleStatus = (id: string, active: boolean) => {
		// TODO: Implementar mutación de toggle real
		console.log("Toggle status:", id, active);
		toast.info("Funcionalidad de activar/desactivar en desarrollo");
	};

	const handleEdit = (promotion: PromotionBackendDTO) => {
		navigate(`/edit/${promotion.id}`);
	};

	const handleDuplicate = (_promotion: PromotionBackendDTO) => {
		// TODO: Implementar lógica de duplicar (podría ser una mutación create con los mismos datos)
		toast.info("Duplicar próximamente");
	};

	const handleDeleteClick = (promotion: PromotionBackendDTO) => {
		setPromotionToDelete(promotion);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (promotionToDelete) {
			// Usamos la mutación de TanStack Query
			deleteMutation.mutate(promotionToDelete.id);
			setDeleteDialogOpen(false);
			setPromotionToDelete(null);
		}
	};

	// RENDERIZADO CONDICIONAL (Loading/Error)
	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-[#21B2B6]" />
				<span className="ml-3 text-lg font-medium text-gray-600">
					Cargando promociones...
				</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center text-red-500">
				<p>Hubo un error al conectar con el servidor.</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-4 underline"
				>
					Reintentar
				</button>{" "}
			</div>
		);
	}

	// RENDERIZADO PRINCIPAL
	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="space-y-8">
					<DashboardHeader onNewPromotion={onNewPromotion} />

					<DashboardToolbar
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						statusFilter={statusFilter}
						onStatusFilterChange={setStatusFilter}
					/>

					<PromotionsTable
						promotions={filteredPromotions}
						onToggleStatus={handleToggleStatus}
						onEdit={handleEdit}
						onDuplicate={handleDuplicate}
						onDelete={handleDeleteClick}
					/>
				</div>
			</div>

			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				promotionName={promotionToDelete?.name || ""}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
};
