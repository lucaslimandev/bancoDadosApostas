"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type OpcaoReatribuicao = { id: string; nome: string };

export function DeleteGuardDialog({
  open,
  onOpenChange,
  itemNome,
  entidadeLabel,
  usageCount,
  opcoesReatribuicao,
  onConfirm,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemNome: string;
  entidadeLabel: string;
  usageCount: number | null;
  opcoesReatribuicao: OpcaoReatribuicao[];
  onConfirm: (reatribuirParaId?: string) => void;
  loading?: boolean;
}) {
  const [reatribuirPara, setReatribuirPara] = useState<string | undefined>(undefined);

  if (usageCount === null) return null;

  const emUso = usageCount > 0;
  const semOpcoes = emUso && opcoesReatribuicao.length === 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir &quot;{itemNome}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            {!emUso && "Esta ação não pode ser desfeita."}
            {emUso &&
              semOpcoes &&
              `${entidadeLabel} está em uso em ${usageCount} operação(ões) e não há outro item cadastrado para reatribuição. Cadastre outro antes de excluir este.`}
            {emUso &&
              !semOpcoes &&
              `${entidadeLabel} está em uso em ${usageCount} operação(ões). Escolha para qual item essas operações devem ser reatribuídas antes da exclusão.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {emUso && !semOpcoes && (
          <div className="space-y-1.5">
            <Label className="text-xs">Reatribuir operações para</Label>
            <Select value={reatribuirPara} onValueChange={(v) => setReatribuirPara(v ?? undefined)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {opcoesReatribuicao.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {!semOpcoes && (
            <AlertDialogAction
              onClick={() => onConfirm(reatribuirPara)}
              disabled={loading || (emUso && !reatribuirPara)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
