import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Promotion } from "@/lib/mockPromotions";

interface PromotionsTableProps {
  promotions: Promotion[];
  onToggleStatus: (id: string, active: boolean) => void;
  onEdit: (promotion: Promotion) => void;
  onDuplicate: (promotion: Promotion) => void;
  onDelete: (promotion: Promotion) => void;
}

export const PromotionsTable = ({
  promotions,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
}: PromotionsTableProps) => {
  const formatDateRange = (from: Date, to?: Date) => {
    const fromStr = format(from, "dd MMM", { locale: es });
    if (!to) return `${fromStr} - Sin fin`;
    const toStr = format(to, "dd MMM", { locale: es });
    return `${fromStr} - ${toStr}`;
  };

  if (promotions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-muted-foreground">No se encontraron promociones</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Vigencia</TableHead>
            <TableHead className="text-center">Prioridad</TableHead>
            <TableHead className="text-center">Activa</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{promotion.name}</p>
                  {promotion.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {promotion.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={promotion.activateImmediately ? "default" : "secondary"}
                  className={
                    promotion.activateImmediately
                      ? "bg-brand-teal hover:bg-brand-teal/90"
                      : ""
                  }
                >
                  {promotion.activateImmediately ? "Activa" : "Inactiva"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDateRange(promotion.dateRange.from, promotion.dateRange.to)}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {promotion.priority}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={promotion.activateImmediately}
                  onCheckedChange={(checked) => onToggleStatus(promotion.id, checked)}
                  className="data-[state=checked]:bg-brand-teal"
                />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(promotion)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(promotion)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(promotion)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
