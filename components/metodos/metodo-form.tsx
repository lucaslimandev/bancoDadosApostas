"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { metodoSchema, type MetodoFormValues } from "@/lib/schemas";
import { calcStakeEmReais } from "@/lib/stake";
import { formatBRL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function MetodoForm({
  defaultValues,
  valorStakeFixa,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting,
}: {
  defaultValues?: Partial<MetodoFormValues>;
  valorStakeFixa: number;
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
    defaultValues: {
      nome: "",
      descricao: "",
      cor: "#3b82f6",
      ativo: true,
      usaBack: true,
      usaLay: true,
      stakesBack: 1,
      stakesLay: 1,
      criterioEntradaPadrao: "",
      criterioSaidaPadrao: "",
      ...defaultValues,
    },
  });

  const cor = watch("cor");
  const ativo = watch("ativo");
  const usaBack = watch("usaBack");
  const usaLay = watch("usaLay");
  const stakesBack = watch("stakesBack");
  const stakesLay = watch("stakesLay");

  const valorBack = calcStakeEmReais(stakesBack, valorStakeFixa);
  const valorLay = calcStakeEmReais(stakesLay, valorStakeFixa);

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

      <div className="space-y-3 rounded-lg border p-3">
        <p className="text-xs text-muted-foreground">
          Configure quantas stakes (múltiplos da stake fixa) este modelo usa em cada lado da operação.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Usa Back</Label>
              <Switch checked={usaBack} onCheckedChange={(v) => setValue("usaBack", v)} />
            </div>
            <Input
              type="number"
              step="0.1"
              disabled={!usaBack}
              {...register("stakesBack", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
              placeholder="Nº de stakes"
            />
            {usaBack && <p className="text-[11px] text-muted-foreground">{stakesBack ?? 0} stakes = {formatBRL(valorBack)}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Usa Lay</Label>
              <Switch checked={usaLay} onCheckedChange={(v) => setValue("usaLay", v)} />
            </div>
            <Input
              type="number"
              step="0.1"
              disabled={!usaLay}
              {...register("stakesLay", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
              placeholder="Nº de stakes"
            />
            {usaLay && <p className="text-[11px] text-muted-foreground">{stakesLay ?? 0} stakes = {formatBRL(valorLay)}</p>}
          </div>
        </div>
        {errors.usaBack && <p className="text-xs text-destructive">{errors.usaBack.message}</p>}

        <p className="text-[11px] text-muted-foreground border-t pt-2">
          1 stake fixa atual = {formatBRL(valorStakeFixa)} (definida em Configurações)
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Critério de entrada padrão</Label>
        <Textarea rows={2} {...register("criterioEntradaPadrao")} placeholder="Sugerido automaticamente ao registrar a operação" />
      </div>

      <div className="space-y-1.5">
        <Label>Critério de saída padrão</Label>
        <Textarea rows={2} {...register("criterioSaidaPadrao")} placeholder="Opcional" />
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
