# Prompt para Claude Code — App de Gestão de Trading Esportivo

> Cole tudo o que está abaixo (a partir de "## Objetivo") como a sua primeira mensagem no Claude Code, dentro de uma pasta vazia. Se quiser, adapte os valores marcados com 👉.

---

## Objetivo

Construa um **web app completo e profissional de gestão de trading esportivo** (lay / back / trade, pré-jogo e ao vivo), rodando localmente e pronto para deploy. Sou trader esportivo profissional e preciso de uma ferramenta de nível sênior para registrar operações, acompanhar performance em tempo real e disciplinar minha gestão de banca. **Não quero uma planilha — quero um aplicativo web real, interativo e bonito.**

Trabalhe de forma autônoma: planeje a arquitetura, crie os arquivos, instale dependências, rode o projeto, teste e corrija erros até estar 100% funcional. Faça commits incrementais com mensagens claras. Ao final, deixe um README explicando como rodar.

## Stack obrigatória

- **Next.js 14+ (App Router) + TypeScript**
- **Tailwind CSS** + **shadcn/ui** para os componentes
- **Zustand** para estado global
- **TanStack Query** se houver chamadas assíncronas
- **Recharts** para todos os gráficos
- **react-day-picker** ou **FullCalendar** para o calendário interativo
- **date-fns** para datas
- **Lucide React** para ícones
- **Framer Motion** para microanimações
- **Prisma + SQLite** como banco local (fácil de rodar), modelado para migrar a Postgres depois
- **Zod** para validação de formulários, com **React Hook Form**
- Persistência: banco via Prisma; e fallback/local-first com possibilidade de export/import em JSON e CSV

Use boas práticas: componentes reutilizáveis, tipagem forte, organização por feature, server actions onde fizer sentido, e responsividade total (desktop e mobile).

## Conceitos do domínio (entenda antes de modelar)

- Tudo é medido em **unidades (u)**. 1 unidade = um valor fixo em dinheiro que o usuário define nas configurações (ex.: 1u = R$50).
- Tipos de operação: **Lay**, **Back**, **Trade**.
- No **Lay**, a exposição real é a **responsabilidade** (= stake × (odd − 1)), não a stake. Isso precisa estar explícito na UI e nos cálculos de risco.
- Resultado de cada operação: **Green**, **Red** ou **Anulado**.
- Métricas-chave: **ROI**, **Yield**, **Taxa de acerto**, **Banca acumulada**, **Pico de banca**, **Drawdown** (banca atual − pico), **Drawdown máximo**, sequências (streaks) de greens/reds.

## Modelo de dados (Prisma)

Crie ao menos estas entidades:

**Operacao**
- id, data (DateTime), liga (string), timeCasa (string), timeFora (string)
- mercado (string), metodo (string), tipo (enum Lay|Back|Trade)
- momento (string — ex.: "Pré-jogo", "35' 1ºT")
- oddEntrada (float), oddSaida (float?), stake (float), responsabilidade (float?)
- resultado (enum Green|Red|Anulado)
- lucro (float — pode ser calculado ou sobrescrito manualmente pelo usuário)
- observacoes (string?)
- createdAt, updatedAt

**Configuracao** (singleton)
- bancaInicial (float, em unidades), valorUnidade (float, em dinheiro)
- stopLossDiario (float, u), stopGainDiario (float, u)
- stakePadraoPercent (float), maxOperacoesSimultaneas (int)

**Meta** (mensal)
- mes (string YYYY-MM), metaLucroUnidades (float), metaOperacoes (int)

Inclua **seed** com ~15 operações de exemplo realistas (ligas: Brasileirão Série A, Premier League, La Liga, Serie A, Bundesliga, Ligue 1; métodos: Pressão Reversa, Scalping Ao Vivo, Lay Empate, Cash Out Verde) para a interface já nascer populada. O usuário poderá limpar tudo com um botão.

## Telas / funcionalidades

### 1. Dashboard (home)
- Cartões de KPI no topo, animados: **Lucro Total (u)**, **ROI Médio**, **Yield**, **Taxa de Acerto**, **Banca Atual (u)**, **Nº de Operações**, **Drawdown Máximo (u)**, **Sequência Atual** (streak).
- Cada KPI mostra também o valor em dinheiro (u × valorUnidade) e uma seta de tendência.
- Gráfico de **curva de evolução da banca** (linha, área preenchida) ao longo do tempo.
- Gráfico de **drawdown** (área vermelha abaixo de zero).
- Gráfico de **lucro por método** (barras).
- Gráfico de **lucro por liga** (barras horizontais).
- Gráfico de **distribuição Lay/Back/Trade** (donut).
- Filtros globais no topo: intervalo de datas, liga, método, tipo — que recalculam todos os KPIs e gráficos.

### 2. Calendário (requisito central)
- Calendário mensal interativo (clicável). Cada dia mostra um **indicador colorido**: verde se o lucro do dia foi positivo, vermelho se negativo, cinza se neutro/sem operação, com o **valor de lucro do dia em u** exibido no quadradinho.
- Heatmap de intensidade: dias mais lucrativos com verde mais forte; reds mais fortes com vermelho mais forte.
- **Ao clicar em um dia**, abrir um painel lateral (sheet/drawer) ou modal mostrando **todas as operações daquele dia** em detalhe: jogo, mercado, método, tipo, odds, stake, resultado e lucro — com o **resumo do dia** (lucro total, nº de greens/reds, ROI do dia).
- Possibilidade de **adicionar uma nova operação já com a data daquele dia** direto do painel.
- Navegação por mês/ano e um seletor para alternar entre visão mensal e visão de lista.
- Mostrar marcadores de **stop loss / stop gain batido** no dia (badge de alerta) quando o lucro do dia cruzar os limites configurados.

### 3. Operações (CRUD completo)
- Tabela avançada com ordenação, busca, paginação e filtros por todas as colunas.
- Formulário de criação/edição (React Hook Form + Zod) com lista suspensa para tipo e resultado, cálculo automático de responsabilidade no Lay e de lucro sugerido (Back: stake×(odd−1); Lay green: stake líquido; Trade: variação de odd), permitindo sobrescrita manual.
- Ações: editar, duplicar, excluir (com confirmação).
- Colorização verde/vermelho por resultado e por lucro.
- Botões de **exportar CSV/JSON** e **importar CSV/JSON**.

### 4. Gestão de Banca & Regras
- **Calculadora de stake**: entra banca atual, stake % e odd lay pretendida → retorna stake recomendada, responsabilidade e % da banca em risco, com aviso visual se o risco exceder um limite.
- Painel de **regras de ouro de disciplina** (lista editável; já vir preenchida com: stake 1–3%, nunca aumentar após red, stop loss/gain diário, máx 2 operações simultâneas ao vivo, registrar antes do resultado, proibido martingale, revisão semanal, fechar ao detectar tilt).
- **Tracker de stop diário**: visão do dia atual mostrando lucro acumulado vs stop loss e stop gain, com barra de progresso e alerta visual ("PARE — stop loss atingido" / "Meta do dia batida").

### 5. Metas mensais
- Definir meta de lucro (u) e de nº de operações por mês.
- Barra de progresso e comparação realizado vs meta, com gráfico do histórico mensal.

### 6. Configurações
- Definir banca inicial, valor da unidade (R$), stop loss/gain diário, stake padrão %, máx operações simultâneas.
- Alternância de **tema claro/escuro**.
- Botão de **limpar todos os dados** e de **restaurar dados de exemplo**.

## Design / UX

- Estética sofisticada e "fintech/trading": paleta com **azul-marinho profundo, verde de lucro, vermelho de perda e um dourado de destaque**; tipografia limpa (Inter ou similar); cantos arredondados; sombras suaves; bom uso de espaço em branco.
- Sidebar de navegação com ícones (Dashboard, Calendário, Operações, Gestão, Metas, Configurações).
- Microanimações com Framer Motion (entrada de cards, transições de página, contadores animados nos KPIs).
- Totalmente responsivo; no mobile a sidebar vira menu inferior ou hambúrguer.
- Estados vazios bem cuidados (quando não há operações) e skeletons de carregamento.
- Inclua um **aviso discreto** em algum rodapé: trading esportivo envolve risco real de perda, a ferramenta auxilia o controle de risco mas não o elimina, e não constitui recomendação de investimento.

## Qualidade e entrega

- Código limpo, tipado e organizado por feature.
- Sem erros de build nem de lint; rode `npm run build` e corrija o que aparecer.
- Inclua um **README.md** com: descrição, stack, como instalar (`npm install`), como rodar migrations/seed do Prisma e como iniciar (`npm run dev`).
- Faça o app rodar de fato no fim e me diga a URL local.
- Se algo for ambíguo, tome a decisão mais profissional e siga — não pare para perguntar a cada passo.

👉 Ajuste se quiser: 1u = R$ ____, stop loss diário = ___ u, stop gain diário = ___ u, suas ligas e métodos preferidos.

Comece planejando a arquitetura e depois mãos à obra.
