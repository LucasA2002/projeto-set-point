# SetPoint
SetPoint é um projeto individual sobre Tênis, desenvolvido para organizar campeonatos entre amigos.

## Visão geral
O objetivo do SetPoint é facilitar a vida de grupos de amigos que jogam tênis e querem:
- organizar torneios com chaveamento
- registrar placares e pontuações
- acompanhar ranking do grupo
- salvar quadras recomendadas pelo próprio grupo

## Funcionalidades
### MVP
- Cadastro e login de usuários
- Criação de grupos privados com código de convite
- Cadastro de participantes no grupo
- Sorteio de chaveamento por bracket
- Registro de partidas e resultados
- Leaderboard (ranking por pontos e vitórias)
- Cadastro de quadras dentro do grupo (nome, bairro, piso, preço, observações)

## Stack
- Frontend: HTML + CSS + JavaScript
- Backend: API com Node.js
- Banco de dados: MySQL

## Arquitetura:
- Frontend (formulários e telas) chama a API
- API valida dados, aplica regras e grava/consulta no banco
- Frontend exibe listas, rankings e dashboards

## Requisitos
- Node.js
- Banco MySQL rodando localmente

## Como rodar o projeto
```bash
git clone <https://github.com/LucasA2002/projeto-set-point.git>
cd projeto-set-point