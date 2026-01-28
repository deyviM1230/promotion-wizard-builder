import { useState, useMemo } from "react";
import { mockPromotions, Promotion } from "@/lib/mockPromotions";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardToolbar } from "./DashboardToolbar";
import { PromotionsTable } from "./PromotionsTable";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { toast } from "sonner";

interface PromotionsDashboardProps {
  onNewPromotion: () => void;
}

export const PromotionsDashboard = ({ onNewPromotion }: PromotionsDashboardProps) => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      // Search filter
      const matchesSearch = promo.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && promo.activateImmediately) ||
        (statusFilter === "inactive" && !promo.activateImmediately);

      return matchesSearch && matchesStatus;
    });
  }, [promotions, searchQuery, statusFilter]);

  const handleToggleStatus = (id: string, active: boolean) => {
    setPromotions((prev) =>
      prev.map((promo) =>
        promo.id === id ? { ...promo, activateImmediately: active } : promo
      )
    );
    toast.success(active ? "Promoción activada" : "Promoción desactivada");
  };

  const handleEdit = (promotion: Promotion) => {
    toast.info(`Editar: ${promotion.name}`);
    // TODO: Navigate to wizard with promotion data
  };

  const handleDuplicate = (promotion: Promotion) => {
    const duplicated: Promotion = {
      ...promotion,
      id: `promo-${Date.now()}`,
      name: `${promotion.name} (copia)`,
      createdAt: new Date(),
    };
    setPromotions((prev) => [duplicated, ...prev]);
    toast.success("Promoción duplicada");
  };

  const handleDeleteClick = (promotion: Promotion) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (promotionToDelete) {
      setPromotions((prev) =>
        prev.filter((promo) => promo.id !== promotionToDelete.id)
      );
      toast.success("Promoción eliminada");
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
    }
  };

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
