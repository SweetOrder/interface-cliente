import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Address } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipcode: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP deve ter no máximo 9 caracteres"),
  isDefault: z.boolean().default(false)
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  userId: number;
  address?: Address;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddressForm({ userId, address, onSuccess, onCancel }: AddressFormProps) {
  const { toast } = useToast();
  const isEditing = !!address;

  const defaultValues: Partial<AddressFormValues> = {
    street: address?.street || "",
    number: address?.number || "",
    complement: address?.complement || "",
    neighborhood: address?.neighborhood || "",
    city: address?.city || "",
    state: address?.state || "",
    zipcode: address?.zipcode || "",
    isDefault: address?.isDefault || false
  };

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues
  });

  const onSubmit = async (values: AddressFormValues) => {
    try {
      if (isEditing && address) {
        // Updating existing address
        await apiRequest(`/api/addresses/${address.id}`, {
          method: "PATCH",
          body: JSON.stringify({ ...values, userId })
        });
        toast({
          title: "Endereço atualizado",
          description: "Seu endereço foi atualizado com sucesso."
        });
      } else {
        // Creating new address
        await apiRequest("/api/addresses", {
          method: "POST",
          body: JSON.stringify({ ...values, userId })
        });
        toast({
          title: "Endereço adicionado",
          description: "Seu novo endereço foi adicionado com sucesso."
        });
      }
      
      // Invalidate addresses cache
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/addresses`] });
      
      // Reset form and call success callback
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu endereço. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da rua" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="Número" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Apartamento, bloco, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="Estado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Definir como endereço padrão</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Atualizar Endereço" : "Adicionar Endereço"}
          </Button>
        </div>
      </form>
    </Form>
  );
}