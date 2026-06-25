"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Operacao } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Copy, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { cn, formatU } from "@/lib/utils";

type Coluna = "data" | "liga" | "tipo" | "metodo" | "stake" | "resultado" | "lucro";

const PAGE_SIZE = 10;

function CabecalhoOrdenavel({
  c,
  coluna,
  onSort,
  children,
}: {
  c: Coluna;
  coluna: Coluna;
  onSort: (c: Coluna) => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={() => onSort(c)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {children}
      <ArrowUpDown className={cn("size-3", coluna === c ? "text-foreground" : "text-muted-foreground/50")} />
    </button>
  );
}

export function OperacoesTable({
  operacoes,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  operacoes: Operacao[];
  onEdit: (op: Operacao) => void;
  onDuplicate: (op: Operacao) => void;
  onDelete: (op: Operacao) => void;
}) {
  const [busca, setBusca] = useState("");
  const [coluna, setColuna] = useState<Coluna>("data");
  const [asc, setAsc] = useState(false);
  const [pagina, setPagina] = useState(1);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return operacoes;
    return operacoes.filter((op) =>
      [op.liga, op.timeCasa, op.timeFora, op.mercado, op.metodo, op.tipo, op.resultado]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [operacoes, busca]);

  const ordenadas = useMemo(() => {
    const copia = [...filtradas];
    copia.sort((a, b) => {
      let comp = 0;
      if (coluna === "data") comp = new Date(a.data).getTime() - new Date(b.data).getTime();
      else if (coluna === "stake") comp = a.stake - b.stake;
      else if (coluna === "lucro") comp = a.lucro - b.lucro;
      else comp = String(a[coluna]).localeCompare(String(b[coluna]));
      return asc ? comp : -comp;
    });
    return copia;
  }, [filtradas, coluna, asc]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const paginadas = ordenadas.slice((paginaAtual - 1) * PAGE_SIZE, paginaAtual * PAGE_SIZE);

  function ordenarPor(c: Coluna) {
    if (c === coluna) setAsc(!asc);
    else {
      setColuna(c);
      setAsc(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar por liga, time, método..."
            className="pl-8"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{ordenadas.length} operações</span>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><CabecalhoOrdenavel c="data" coluna={coluna} onSort={ordenarPor}>Data</CabecalhoOrdenavel></TableHead>
              <TableHead>Jogo</TableHead>
              <TableHead><CabecalhoOrdenavel c="liga" coluna={coluna} onSort={ordenarPor}>Liga</CabecalhoOrdenavel></TableHead>
              <TableHead><CabecalhoOrdenavel c="metodo" coluna={coluna} onSort={ordenarPor}>Método</CabecalhoOrdenavel></TableHead>
              <TableHead><CabecalhoOrdenavel c="tipo" coluna={coluna} onSort={ordenarPor}>Tipo</CabecalhoOrdenavel></TableHead>
              <TableHead><CabecalhoOrdenavel c="stake" coluna={coluna} onSort={ordenarPor}>Stake</CabecalhoOrdenavel></TableHead>
              <TableHead><CabecalhoOrdenavel c="resultado" coluna={coluna} onSort={ordenarPor}>Resultado</CabecalhoOrdenavel></TableHead>
              <TableHead className="text-right"><CabecalhoOrdenavel c="lucro" coluna={coluna} onSort={ordenarPor}>Lucro</CabecalhoOrdenavel></TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginadas.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                  Nenhuma operação encontrada.
                </TableCell>
              </TableRow>
            )}
            {paginadas.map((op) => (
              <TableRow key={op.id}>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {format(new Date(op.data), "dd/MM/yy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-sm">
                  {op.timeCasa} <span className="text-muted-foreground">x</span> {op.timeFora}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{op.liga}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{op.metodo}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{op.tipo}</Badge>
                </TableCell>
                <TableCell className="text-sm tabular-nums">{op.stake.toFixed(1)}u</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      op.resultado === "Green" && "bg-profit/15 text-profit border-transparent",
                      op.resultado === "Red" && "bg-loss/15 text-loss border-transparent",
                      op.resultado === "Anulado" && "bg-muted text-muted-foreground border-transparent"
                    )}
                  >
                    {op.resultado}
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right tabular-nums font-medium",
                    op.lucro > 0 && "text-profit",
                    op.lucro < 0 && "text-loss"
                  )}
                >
                  {formatU(op.lucro, 2)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted">
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(op)}>
                        <Pencil className="size-3.5" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(op)}>
                        <Copy className="size-3.5" /> Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(op)}>
                        <Trash2 className="size-3.5" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={paginaAtual <= 1} onClick={() => setPagina(paginaAtual - 1)}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={paginaAtual >= totalPaginas} onClick={() => setPagina(paginaAtual + 1)}>
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
