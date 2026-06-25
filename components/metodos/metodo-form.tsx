"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { metodoSchema, type MetodoFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function MetodoForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting,
}: {
  defaultValues?: Partial<MetodoFormValues>;
  onSubmit: (values: MetodoFormValues) => Promise<void> | void;
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
  } = useForm<MetodoFormValues>({
    resolver: zodResolver(metodoSchema),
    defaultValues: { nome: "", descricao: "", cor: "#3b82f6", ativo: true, ...defaultValues },
  });

  const cor = watch("cor");
  const ativo = watch("ativo");

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome</Label>
        <Input {...register("nome")} placeholder="Ex.: Lay Empate" />
        {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Descrição</Label>
        <Textarea rows={2} {...register("descricao")} placeholder="Opcional" />
      </div>

      <div className="space-y-1.5">
        <Label>Cor</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={cor}
            onChange={(e) => setValue("cor", e.target.value)}
            className="size-9 rounded-md border border-input cursor-pointer"
          />
          <Input {...register("cor")} placeholder="#3b82f6" className="flex-1" />
        </div>
        {errors.cor && <p className="text-xs text-destructive">{errors.cor.message}</p>}
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
