import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onNewPromotion: () => void;
}

export const DashboardHeader = ({ onNewPromotion }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Promociones Activas
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona y monitorea tus campañas de descuento
        </p>
      </div>
      <Button
        onClick={onNewPromotion}
        className="bg-brand-orange hover:bg-brand-orange-hover text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nueva Promoción
      </Button>
    </div>
  );
};
