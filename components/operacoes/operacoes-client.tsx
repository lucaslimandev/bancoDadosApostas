"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Operacao, Liga, Metodo, Time } from "@/lib/types";
import type { OperacaoFormValues } from "@/lib/schemas";
import {
  criarOperacao,
  atualizarOperacao,
  excluirOperacao,
  excluirOperacoesEmMassa,
  duplicarOperacao,
  importarOperacoesPorNome,
} from "@/lib/actions/operacoes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OperacaoForm } from "@/components/operacoes/operacao-form";
import { OperacoesTable } from "@/components/operacoes/operacoes-table";
import { FiltrosBar } from "@/components/dashboard/filtros-bar";
import { useFiltrosStore } from "@/lib/store/filters";
import { aplicarFiltros } from "@/lib/filter-operacoes";
import { exportarOperacoesCSV, exportarOperacoesJSON, importarArquivoOperacoes } from "@/lib/csv";
import { Download, FileUp, Plus, ChevronDown, Trash2, X } from "lucide-react";

export function OperacoesClient({
  operacoes,
  ligas,
  metodos,
  times,
}: {
  operacoes: Operacao[];
  ligas: Liga[];
  metodos: Metodo[];
  times: Time[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filtros = useFiltrosStore();
  const operacoesFiltradas = useMemo(() => aplicarFiltros(operacoes, filtros), [operacoes, filtros]);
  const [sheetAberto, setSheetAberto] = useState(false);
  const [editando, setEditando] = useState<Operacao | null>(null);
  const [excluindo, setExcluindo] = useState<Operacao | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [excluindoEmMassa, setExcluindoEmMassa] = useState(false);
  const [excluindoEmMassaLoading, setExcluindoEmMassaLoading] = useState(false);

  const operacoesSelecionadas = useMemo(() => operacoes.filter((o) => selectedIds.has(o.id)), [operacoes, selectedIds]);

  function abrirCriacao() {
    setEditando(null);
    setSheetAberto(true);
  }

  function abrirEdicao(op: Operacao) {
    setEditando(op);
    setSheetAberto(true);
  }

  async function handleSubmit(values: OperacaoFormValues) {
    setSubmitting(true);
    try {
      if (editando) {
        await atualizarOperacao(editando.id, values);
        toast.success("Operação atualizada.");
      } else {
        await criarOperacao(values);
        toast.success("Operação registrada.");
      }
      setSheetAberto(false);
      router.refresh();
    } catch (e) {
      toast.error("Não foi possível salvar a operação.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDuplicate(op: Operacao) {
    await duplicarOperacao(op.id);
    toast.success("Operação duplicada.");
    router.refresh();
  }

  async function handleDelete() {
    if (!excluindo) return;
    await excluirOperacao(excluindo.id);
    toast.success("Operação excluída.");
    setExcluindo(null);
    router.refresh();
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function toggleSelectAll(idsFiltrados: string[]) {
    setSelectedIds((prev) => {
      const todosSelecionados = idsFiltrados.length > 0 && idsFiltrados.every((id) => prev.has(id));
      if (todosSelecionados) {
        const novo = new Set(prev);
        idsFiltrados.forEach((id) => novo.delete(id));
        return novo;
      }
      return new Set([...prev, ...idsFiltrados]);
    });
  }

  async function handleExcluirEmMassa() {
    setExcluindoEmMassaLoading(true);
    try {
      const count = await excluirOperacoesEmMassa(Array.from(selectedIds));
      toast.success(`${count} operações excluídas.`);
      setSelectedIds(new Set());
      setExcluindoEmMassa(false);
      router.refresh();
    } catch (e) {
      toast.error("Não foi possível excluir as operações selecionadas.");
      console.error(e);
    } finally {
      setExcluindoEmMassaLoading(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const linhas = await importarArquivoOperacoes(file);
      const resultado = await importarOperacoesPorNome(linhas);
      toast.success(
        `${resultado.importadas} operações importadas` +
          (resultado.ligasCriadas || resultado.metodosCriados || resultado.timesCriados
            ? ` (criados: ${resultado.ligasCriadas} ligas, ${resultado.metodosCriados} métodos, ${resultado.timesCriados} times)`
            : ".")
      );
      router.refresh();
    } catch (err) {
      toast.error("Falha ao importar arquivo. Verifique o formato.");
      console.error(err);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Operações</h1>
          <p className="text-sm text-muted-foreground">Histórico completo de operações registradas.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
              <Download className="size-3.5" /> Exportar <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportarOperacoesCSV(operacoesFiltradas)}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportarOperacoesJSON(operacoesFiltradas)}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="size-3.5" /> Importar
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleImport} />
          <Button size="sm" className="gap-1.5" onClick={abrirCriacao}>
            <Plus className="size-3.5" /> Nova operação
          </Button>
        </div>
      </div>

      <FiltrosBar ligas={ligas} metodos={metodos} times={times} />

      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2.5 mb-3">
          <span className="text-sm font-medium">{selectedIds.size} operações selecionadas</span>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
                <Download className="size-3.5" /> Exportar selecionadas <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportarOperacoesCSV(operacoesSelecionadas)}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportarOperacoesJSON(operacoesSelecionadas)}>JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setExcluindoEmMassa(true)}>
              <Trash2 className="size-3.5" /> Excluir selecionadas
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setSelectedIds(new Set())}>
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      <OperacoesTable
        operacoes={operacoesFiltradas}
        onEdit={abrirEdicao}
        onDuplicate={handleDuplicate}
        onDelete={(op) => setExcluindo(op)}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
        <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editando ? "Editar operação" : "Nova operação"}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <OperacaoForm
              ligas={ligas}
              metodos={metodos}
              times={times}
              defaultValues={editando ? toFormValues(editando) : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSheetAberto(false)}
              submitLabel={editando ? "Salvar alterações" : "Registrar"}
              isSubmitting={submitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!excluindo} onOpenChange={(open) => !open && setExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir operação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A operação será removida permanentemente do seu histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={excluindoEmMassa} onOpenChange={setExcluindoEmMassa}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {selectedIds.size} operações?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as operações selecionadas serão removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExcluirEmMassa}
              disabled={excluindoEmMassaLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function toFormValues(op: Operacao): OperacaoFormValues {
  return {
    data: new Date(op.data),
    ligaId: op.ligaId,
    timeCasaId: op.timeCasaId,
    timeForaId: op.timeForaId,
    mercado: op.mercado,
    metodoId: op.metodoId,
    tipo: op.tipo,
    momento: op.momento,
    oddEntrada: op.oddEntrada,
    oddSaida: op.oddSaida,
    stake: op.stake,
    responsabilidade: op.responsabilidade,
    resultado: op.resultado,
    lucro: op.lucro,
    observacoes: op.observacoes,
  };
}
