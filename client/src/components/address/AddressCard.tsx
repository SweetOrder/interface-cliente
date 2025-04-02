import React from "react";
import { Address } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: (address: Address) => void;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
  className?: string;
}

export default function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  className
}: AddressCardProps) {
  return (
    <Card 
      className={cn(
        "relative border-2 transition-all",
        isSelected ? "border-primary" : "hover:border-gray-300",
        className
      )}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
          <Check size={16} />
        </div>
      )}
      
      {address.isDefault && (
        <div className="absolute top-2 right-2 text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-1">
          Padrão
        </div>
      )}
      
      <CardContent className="pt-6">
        <div className="flex items-start mb-3">
          <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{address.street}, {address.number}</p>
            {address.complement && <p className="text-sm text-muted-foreground">{address.complement}</p>}
            <p className="text-sm text-muted-foreground">
              {address.neighborhood}, {address.city} - {address.state}
            </p>
            <p className="text-sm text-muted-foreground">{address.zipcode}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          {onSelect && (
            <Button
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => onSelect(address)}
            >
              {isSelected ? "Selecionado" : "Selecionar"}
            </Button>
          )}
          
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onEdit(address)}
              >
                <Pencil size={16} />
              </Button>
            )}
            
            {onDelete && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(address)}
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}