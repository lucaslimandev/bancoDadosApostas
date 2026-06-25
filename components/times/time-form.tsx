"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timeSchema, type TimeFormValues } from "@/lib/schemas";
import type { Liga } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TimeForm({
  ligas,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting,
}: {
  ligas: Liga[];
  defaultValues?: Partial<TimeFormValues>;
  onSubmit: (values: TimeFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TimeFormValues>({
    resolver: zodResolver(timeSchema),
    defaultValues: { nome: "", pais: "", abreviacao: "", ligaId: null, ativo: true, ...defaultValues },
  });

  const ligaId = watch("ligaId");
  const ativo = watch("ativo");

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome</Label>
        <Input {...register("nome")} placeholder="Ex.: Flamengo" />
        {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Liga</Label>
        <Select value={ligaId ?? "nenhuma"} onValueChange={(v) => setValue("ligaId", v === "nenhuma" ? null : v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a liga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nenhuma">Sem liga vinculada</SelectItem>
            {ligas.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>País</Label>
          <Input {...register("pais")} placeholder="Opcional" />
        </div>
        <div className="space-y-1.5">
          <Label>Abreviação</Label>
          <Input {...register("abreviacao")} placeholder="Ex.: FLA" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
        <Label className="cursor-pointer">Ativo</Label>
        <Switch checked={ativo} onCheckedChange={(v) => setValue("ativo", v)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
