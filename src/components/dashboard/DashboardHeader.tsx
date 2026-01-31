import { Building2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const DashboardHeader = () => {
	const navigate = useNavigate();

	return (
		<div className="space-y-6 p-6 bg-gradient-to-r from-primary/5 to-transparent rounded-xl">
			{/* Logo Section */}
			<div className="flex items-center justify-between border-b pb-6">
				<div className="flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal/10">
						<Building2 className="h-6 w-6 text-brand-teal" />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-foreground">Mi Negocio</h2>
						<p className="text-sm text-muted-foreground">Panel de promociones</p>
					</div>
				</div>
				<ThemeToggle />
			</div>

			{/* Title and Action */}
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
					onClick={() => navigate("/create")}
					className="bg-brand-orange hover:bg-brand-orange-hover text-white"
				>
					<Plus className="mr-2 h-4 w-4" />
					Nueva Promoción
				</Button>
			</div>
		</div>
	);
};
