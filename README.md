# TradeEsportivo

Web app de gestão de trading esportivo (lay / back / trade, pré-jogo e ao vivo). Permite registrar operações,
acompanhar performance em tempo real e disciplinar a gestão de banca, com tudo medido em **unidades (u)** —
onde 1u corresponde a um valor fixo em dinheiro definido nas configurações.

## Funcionalidades

- **Dashboard**: KPIs animados (lucro total, ROI, yield, taxa de acerto, banca atual, drawdown máximo, streak),
  gráficos de evolução da banca, drawdown, lucro por método (com a cor cadastrada de cada método)/liga e
  distribuição por tipo, com filtros globais combináveis por período, liga, método, time e tipo.
- **Calendário**: visão mensal com heatmap de lucro diário, badges de stop loss/gain batido, painel lateral com
  detalhes das operações do dia e atalho para registrar uma nova operação direto na data, visão em lista e os
  mesmos filtros globais (liga/método/time/tipo).
- **Operações**: CRUD completo com tabela ordenável/filtrável/paginável, seleção em massa (checkbox por linha e
  "selecionar todos" respeitando os filtros ativos) com exclusão e exportação em massa, formulário com selects
  relacionais (liga/método/times) com busca e criação inline, cálculo automático de responsabilidade (lay) e
  lucro sugerido, duplicação e exportação/importação em CSV/JSON.
- **Métodos**: cadastro de métodos (nome, descrição, cor, ativo/inativo) usados nas operações e nos gráficos.
- **Ligas**: cadastro de ligas, copas, competições continentais e de seleções (nome, país, tipo, nível), com
  importação via CSV/JSON e seed inicial com as principais ligas e competições do mundo.
- **Times**: cadastro de times vinculados a uma liga, com importação via CSV/JSON (criando a liga automaticamente
  quando necessário) e seed inicial com clubes das principais ligas.
- **Gestão de Banca & Regras**: calculadora de stake/responsabilidade/risco, lista editável de regras de ouro e
  tracker de stop diário com alertas visuais.
- **Metas mensais**: definição de meta de lucro e de número de operações, com progresso e histórico mensal.
- **Configurações**: parâmetros da banca (banca inicial, valor da unidade, stops diários, stake padrão, máx.
  operações simultâneas), alternância de tema claro/escuro, limpeza de dados e restauração dos dados de exemplo.

Excluir um método, liga ou time que esteja em uso bloqueia a exclusão a menos que você reatribua as operações
afetadas para outro item do mesmo tipo — nenhuma operação fica órfã.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (sobre Base UI)
- Zustand (estado global de filtros e regras)
- TanStack Query (provider configurado para chamadas assíncronas client-side)
- Recharts (gráficos)
- react-day-picker + date-fns (calendário e datas)
- Lucide React (ícones) + Framer Motion (microanimações)
- Prisma + SQLite (`@prisma/adapter-better-sqlite3`), modelado para migrar a Postgres no futuro
- Zod + React Hook Form (formulários e validação)
- Papaparse (exportação/importação CSV)

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo (o padrão já funciona para uso local com SQLite):

```bash
cp .env.example .env
```

### 3. Criar o banco e popular com dados de exemplo

```bash
npm run db:migrate   # cria/atualiza o banco SQLite local (dev.db) a partir do schema do Prisma
npm run db:seed       # popula configuração padrão, metas, catálogos (métodos/ligas/times) e ~16 operações de exemplo
```

Outros comandos úteis do Prisma:

```bash
npm run db:studio     # abre o Prisma Studio para inspecionar os dados
npm run db:reset       # reseta o banco e roda as migrations + seed novamente
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
npm run build
npm run start
```

## Modelo de dados

Além de `Operacao`, `Configuracao` e `Meta`, o schema inclui três entidades de catálogo, todas referenciadas por
relação (não por texto solto) a partir de `Operacao`:

- **Metodo**: `nome` (único), `descricao`, `cor` (hex), `ativo`.
- **Liga**: `nome` (único), `pais`, `tipo` (`Liga` | `Copa` | `Continental` | `Selecoes`), `nivel`, `ativo`.
- **Time**: `nome`, `pais`, `abreviacao`, `ligaId` (opcional), `ativo`.

`Operacao.ligaId`, `metodoId`, `timeCasaId` e `timeForaId` são obrigatórios e protegidos contra exclusão em
cascata (`onDelete: Restrict`/`SetNull`): a UI sempre conta o uso antes de excluir um item do catálogo e oferece
reatribuir as operações afetadas para outro item, ou bloqueia a exclusão se não houver para onde reatribuir.

## Importação via CSV/JSON

Os botões "Importar" em Operações, Ligas e Times aceitam arquivos `.csv` (com cabeçalho) ou `.json` (array de
objetos) com as colunas abaixo. Itens referenciados por nome que não existirem ainda são criados automaticamente
(ligas/métodos/times), e linhas com nome já cadastrado são reportadas como ignoradas.

**Operações** — `data, ligaNome, timeCasaNome, timeForaNome, mercado, metodoNome, tipo, momento, oddEntrada,
oddSaida, stake, responsabilidade, resultado, lucro, observacoes`

**Ligas** — `nome, pais, tipo, nivel` (tipo: `Liga` | `Copa` | `Continental` | `Selecoes`)

**Times** — `nome, pais, liga, abreviacao` (a coluna `liga` é o nome da liga; se não existir, é criada)

## Estrutura do projeto

```
app/                 rotas (App Router): dashboard, calendario, operacoes, metodos, ligas, times, gestao, metas,
                     configuracoes
components/          componentes de UI organizados por feature (dashboard, calendario, operacoes, metodos, ligas,
                     times, catalogos, gestao, metas, configuracoes, charts, layout) + components/ui (shadcn)
lib/                 lógica de domínio: cálculos (ROI, yield, drawdown, streaks), schemas Zod, server actions,
                     stores Zustand, cliente Prisma e dados de seed/catálogo
prisma/              schema.prisma e script de seed
```

## Aviso de risco

Trading esportivo envolve risco real de perda. Esta ferramenta auxilia o controle de risco e a disciplina, mas
não o elimina, e não constitui recomendação de investimento.
