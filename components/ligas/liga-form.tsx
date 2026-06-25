"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ligaSchema, type LigaFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIPOS = ["Liga", "Copa", "Continental", "Selecoes"] as const;
const TIPO_LABEL: Record<string, string> = {
  Liga: "Liga",
  Copa: "Copa",
  Continental: "Continental",
  Selecoes: "Seleções",
};

export function LigaForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting,
}: {
  defaultValues?: Partial<LigaFormValues>;
  onSubmit: (values: LigaFormValues) => Promise<void> | void;
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
  } = useForm<LigaFormValues>({
    resolver: zodResolver(ligaSchema),
    defaultValues: { nome: "", pais: "", tipo: "Liga", nivel: "", ativo: true, ...defaultValues },
  });

  const tipo = watch("tipo");
  const ativo = watch("ativo");

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome</Label>
        <Input {...register("nome")} placeholder="Ex.: Brasileirão Série A" />
        {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>País</Label>
          <Input {...register("pais")} placeholder="Ex.: Brasil" />
          {errors.pais && <p className="text-xs text-destructive">{errors.pais.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setValue("tipo", v as LigaFormValues["tipo"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t} value={t}>
                  {TIPO_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Nível</Label>
        <Input {...register("nivel")} placeholder="Ex.: 1ª divisão (opcional)" />
      </div>

      <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
        <Label className="cursor-pointer">Ativa</Label>
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
