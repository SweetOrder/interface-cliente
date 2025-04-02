import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Address } from "@/lib/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { Skeleton } from "@/components/ui/skeleton";

interface AddressManagerProps {
  userId?: number;
  onSelectAddress?: (address: Address) => void;
  selectedAddressId?: number;
}

export default function AddressManager({ userId, onSelectAddress, selectedAddressId }: AddressManagerProps) {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [addressToDelete, setAddressToDelete] = useState<Address | undefined>(undefined);

  // Fetch user addresses
  const { data: addresses, isLoading } = useQuery({
    queryKey: userId ? [`/api/users/${userId}/addresses`] : null,
    queryFn: () => apiRequest<Address[]>(`/api/users/${userId}/addresses`),
    enabled: !!userId
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: number) => {
      return apiRequest(`/api/addresses/${addressId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Endereço removido",
        description: "O endereço foi removido com sucesso."
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/addresses`] });
    },
    onError: (error) => {
      console.error("Error deleting address:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o endereço. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleDeleteAddress = (address: Address) => {
    setAddressToDelete(address);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddressMutation.mutate(addressToDelete.id);
      setAddressToDelete(undefined);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingAddress(undefined);
  };

  const renderAddresses = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex space-x-2 pt-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!addresses || addresses.length === 0) {
      return (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">Você ainda não possui endereços cadastrados.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Endereço
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isSelected={selectedAddressId === address.id}
            onSelect={onSelectAddress}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
          />
        ))}
      </div>
    );
  };

  if (!userId) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">Faça login para gerenciar seus endereços.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Meus Endereços</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Endereço
        </Button>
      </div>

      {renderAddresses()}

      {/* Add/Edit Address Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Editar Endereço" : "Adicionar Novo Endereço"}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            userId={userId}
            address={editingAddress}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!addressToDelete} 
        onOpenChange={(open) => !open && setAddressToDelete(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Endereço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este endereço? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteAddress}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}