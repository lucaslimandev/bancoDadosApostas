# Prompt 3 para Claude Code — Dinheiro real, stakes por modelo, ao vivo e mobile/web

> Cole tudo abaixo (a partir de "## Contexto") como uma nova mensagem no Claude Code, **na mesma pasta do projeto**. São alterações incrementais importantes sobre o app que já existe.

---

## Contexto

O app de gestão de trading esportivo já está pronto e funcionando (Next.js + TypeScript + Tailwind + shadcn/ui + Zustand + Prisma/SQLite + Recharts), já com cadastro de métodos, ligas, times, importação e exclusão em massa. Agora preciso de mudanças estruturais importantes. Mantenha a mesma stack, o mesmo design e a organização por feature. Trabalhe de forma autônoma: atualize o schema do Prisma, gere migrations, migre os dados existentes sem perder histórico, refatore o que for necessário, rode, teste e corrija até tudo funcionar. Commits incrementais e README atualizado no fim.

## 1. Eliminar "unidades" — tudo em DINHEIRO (R$) e PORCENTAGEM

Remova completamente o conceito de "unidade (u)" de toda a aplicação. Em vez disso:

- Todos os valores monetários passam a ser exibidos em **dinheiro real (R$)**: lucro, banca, stake, responsabilidade, metas, stops, etc. Formate como moeda brasileira (R$ 1.234,56).
- As métricas de performance continuam em **porcentagem**: ROI, Yield e Taxa de Acerto.
- Onde antes aparecia "u" ou "unidades", troque por R$ (valores) ou % (métricas). Atualize KPIs, gráficos, eixos, tooltips, labels, calendário e relatórios.
- Em **Configurações**, remova "valor da unidade". Mantenha **banca inicial (R$)** e adicione o conceito de **stake fixa** descrito abaixo.

## 2. Stake FIXA baseada em porcentagem da banca

- Em **Configurações**, o usuário define uma **stake fixa** que pode ser informada de duas formas (com um toggle):
  - **Valor fixo em R$** (ex.: R$ 50,00), ou
  - **Percentual fixo da banca** (ex.: 2% da banca atual) — neste caso o sistema calcula o valor em R$ automaticamente a partir da banca atual.
- Essa **stake fixa é a unidade base de aposta** ("1 stake"). A ideia é padronizar: o trader não digita valores aleatórios, ele entra com **múltiplos da stake fixa**.
- Mostre em algum lugar visível qual é o valor atual de **1 stake em R$** (recalculado quando a banca muda, se for modo percentual).

## 3. Modelos (Métodos) com número de stakes e stakes separadas para BACK e LAY

Reformule a entidade **Metodo** (modelo) para conter a configuração de stake de cada modelo:

- Cada modelo define **quantas stakes ele entra** — ou seja, o múltiplo da stake fixa usado naquele modelo.
- Cada modelo tem **duas configurações separadas**: uma para **Back** e outra para **Lay**.
  - `stakesBack` (número de stakes na entrada Back, ex.: 1, 2, 1.5)
  - `stakesLay` (número de stakes na entrada Lay)
  - Opcionalmente permitir que um modelo seja só Back, só Lay, ou ambos (flags `usaBack`, `usaLay`).
- Campos sugeridos no Prisma para **Metodo**: id, nome, descricao?, cor, ativo, usaBack (bool), usaLay (bool), stakesBack (float?), stakesLay (float?), criterioEntradaPadrao (string?), criterioSaidaPadrao (string?), createdAt, updatedAt.
- Na tela de **Métodos**, o formulário deve deixar configurar tudo isso de forma clara, mostrando um **preview do valor em R$**: "1 stake = R$ X → este modelo entra com {stakesBack} stakes no Back = R$ Y e {stakesLay} stakes no Lay = R$ Z" (recalculado a partir da stake fixa atual).
- Quando o usuário cadastrar uma operação e escolher o modelo + tipo (Back ou Lay), o sistema deve **pré-preencher automaticamente a stake em R$** com base nas stakes configuradas do modelo (nº de stakes × valor da stake fixa), permitindo ajuste manual.

## 4. Cadastro de operação — pré-live E ao vivo por minuto

O cadastro de operação não é só pré-jogo. Refaça o campo de momento para suportar os dois casos:

- Um seletor de **fase**: "Pré-jogo" ou "Ao vivo".
- Se for **Ao vivo**, habilitar campos para registrar **o minuto da entrada** (ex.: minuto 35) e o **tempo** (1º tempo / 2º tempo / intervalo / prorrogação). Aceitar formatos como "35'", "35' 1ºT", "78' 2ºT".
- Guardar isso de forma estruturada no Prisma (ex.: `fase` enum PreJogo|AoVivo, `minutoEntrada` int?, `periodo` string?), além de manter um campo de exibição amigável.
- Nos filtros e relatórios, permitir **filtrar/analisar por fase** (pré-jogo vs ao vivo) e idealmente por faixa de minuto (ex.: desempenho das entradas até o minuto 30 vs depois). Adicionar um gráfico ou recorte de **desempenho por faixa de minuto** no Dashboard.

## 5. Critério de ENTRADA e critério de SAÍDA (independentes)

Cada operação deve registrar dois critérios separados:

- **Critério de entrada**: o que motivou a entrada (texto livre, com sugestão automática a partir do `criterioEntradaPadrao` do modelo escolhido, podendo editar).
- **Critério de saída**: como/por que saiu da operação. **Esse campo pode ficar vazio no momento do cadastro**, porque a operação pode ainda estar **em andamento** (ainda não saiu).
- Adicionar um **status da operação**: enum `Aberta | Encerrada`.
  - Quando a operação é cadastrada sem saída/resultado definido, ela fica **Aberta** (em andamento).
  - O usuário pode depois **editar a operação para encerrá-la**, preenchendo o critério de saída, a odd de saída, o resultado (Green/Red/Anulado) e o lucro final.
- No Prisma (**Operacao**): adicionar `criterioEntrada` (string?), `criterioSaida` (string?), `status` (enum Aberta|Encerrada, default conforme preenchimento).
- Na UI:
  - Operações **Abertas** devem aparecer destacadas (ex.: badge "Em andamento") e idealmente num bloco/aba separada "Operações abertas" no topo, para o trader saber o que ainda está rodando.
  - O resultado e o lucro de operações Abertas **não entram** nos KPIs fechados (lucro realizado), mas mostre um indicador de **exposição em aberto** (soma das stakes/responsabilidades das operações abertas).
  - Permitir encerrar uma operação rapidamente por um botão "Encerrar" que abre o formulário já focado nos campos de saída.

## 6. Mobile-first e pronto para web (deploy)

Vou hospedar isso e fazer upload em um site. Então:

- Garanta que o app seja **totalmente responsivo e mobile-first**: layout, tabelas (com scroll/cards no mobile), calendário, formulários, sidebar (vira menu inferior ou drawer no mobile), gráficos redimensionáveis. Teste mentalmente em 360px de largura.
- Transforme em **PWA** (instalável no celular): manifest, ícones, service worker básico, funcionamento offline razoável onde fizer sentido.
- Prepare para **deploy**: garanta que builda em produção (`npm run build` sem erros), inclua variáveis de ambiente documentadas, e deixe instruções no README para **deploy na Vercel** (e como trocar SQLite por Postgres/Neon em produção via Prisma, já que SQLite não é ideal em serverless). Se possível, ajuste o schema/datasource para ser facilmente comutável entre SQLite (local) e Postgres (produção).
- Adicione um arquivo de configuração para deploy e cheque que rotas/server actions funcionam no ambiente de produção.

## 7. Melhore tudo 100% — melhorias gerais

Aplique melhorias de qualidade em toda a aplicação:

- **Performance**: memoização de cálculos pesados, queries eficientes, paginação/virtualização em tabelas grandes.
- **UX**: estados de loading (skeletons), estados vazios bem feitos, toasts de sucesso/erro em todas as ações, confirmações em ações destrutivas, atalhos e validações claras com Zod + React Hook Form.
- **Dashboard mais rico**: além do que já existe, adicione cartões de **lucro realizado vs exposição em aberto**, **melhor e pior dia**, **melhor método e melhor liga**, **maior sequência de greens/reds**, e o recorte por fase (pré-jogo vs ao vivo) e por faixa de minuto.
- **Acessibilidade**: contraste adequado, navegação por teclado, aria-labels.
- **Consistência visual**: revise a paleta (azul-marinho, verde lucro, vermelho perda, dourado de destaque), tipografia e espaçamentos; mantenha tema claro/escuro.
- **Robustez**: trate erros de importação, valores inválidos, divisões por zero nas métricas, e datas; nunca quebre a tela.
- **Migração de dados**: ao aplicar as mudanças (remoção de unidades, novos campos), migre os dados existentes sem perda — converta valores antigos para R$ assumindo a configuração atual e marque operações antigas como Encerradas.

## Qualidade e entrega

- Sem erros de build ou lint: rode `npm run build` e corrija tudo.
- Atualize o **README** com: o novo modelo de stake fixa, a configuração de stakes por modelo (back/lay), os campos de fase/minuto, critérios de entrada/saída e status, instruções de PWA e o passo a passo de deploy na Vercel com Postgres.
- Ao final, rode o app, confirme que tudo funciona (dinheiro/%, stake fixa, modelos com stakes back/lay, cadastro ao vivo por minuto, critérios de entrada/saída, operações abertas, mobile/PWA) e me diga a URL local.
- Se algo for ambíguo, tome a decisão mais profissional e siga — não pare a cada passo para perguntar.

Comece pela migração do schema (remoção de unidades + novos campos em Metodo e Operacao) e o plano de migração de dados, depois refatore as telas afetadas e por fim aplique as melhorias gerais e o preparo para deploy.
