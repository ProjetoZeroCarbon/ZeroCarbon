# ZeroCarbon — Backend

API REST em **Node.js + Express + MySQL**, consumida por `frontend/js/api.js`.

## Rodando localmente

Requisitos: Node 18+ e MySQL 5.7+/8.x (ou MariaDB 10.3+) rodando.

```bash
cd backend
npm install
cp .env.example .env      # edite DB_USER, DB_PASSWORD e JWT_SECRET
npm run db:migrate        # cria o banco e as tabelas
npm run dev               # http://localhost:3000/api
```

Teste rápido: `curl http://localhost:3000/api/health` → `{"status":"ok","database":"up"}`

No frontend, sirva a pasta com `npx serve frontend -l 5500` (a origem
`http://localhost:5500` já está liberada no CORS do `.env.example`).

## Banco de dados

| Tabela           | Conteúdo                                                                 |
|------------------|--------------------------------------------------------------------------|
| `users`          | conta, hash bcrypt da senha, perfil e meta mensal (`monthly_goal_tco2`)  |
| `carbon_records` | um cálculo por usuário por mês (`UNIQUE user_id + period_month`)         |

Recalcular dentro do mesmo mês **atualiza** o registro daquele mês (upsert).
Schema completo em `sql/schema.sql`.

## Endpoints (prefixo `/api`)

| Método | Rota                | Auth | Descrição                                   |
|--------|---------------------|:----:|---------------------------------------------|
| GET    | `/health`           |  —   | Status da API e do banco                    |
| POST   | `/auth/register`    |  —   | Cria conta → `{ token, user }`              |
| POST   | `/auth/login`       |  —   | `{ usernameOrEmail, password }` → `{ token, user }` |
| GET    | `/profile`          | JWT  | Dados do usuário                            |
| PUT    | `/profile`          | JWT  | Edita `firstName`, `lastName`, `location`, `email` |
| POST   | `/calculator`       | JWT  | Calcula e salva a pegada do mês             |
| GET    | `/history`          | JWT  | Histórico mensal (mais recente primeiro)    |
| GET    | `/history/summary`  | JWT  | Dados do dashboard                          |

Erros sempre voltam como `{ "message": "..." }`, que é o que o `api.js` exibe.

## Regras de negócio

- Fatores de emissão (iguais ao protótipo original): energia 0,0817 kg/kWh,
  gás 2,02 kg/m³, transporte 0,192 (gasolina) / 0,030 (álcool) / 0,212 (diesel) kg/km.
- Progresso da meta no dashboard = 100% se o total do mês ≤ meta, senão `meta / total`.
  A meta padrão é 0,5 tCO₂/mês (definição minha — ajuste em `historyController.js`).

## Produção

O GitHub Pages só serve arquivos estáticos: esta API e o MySQL precisam ficar
em outro serviço (Render, Railway, Fly.io, VPS etc.). Depois:

1. Defina no servidor `JWT_SECRET`, as variáveis `DB_*` e `CORS_ORIGINS=https://SEU_USUARIO.github.io`.
2. No frontend, aponte para a API publicada com
   `<script>window.ZEROCARBON_API_URL = "https://sua-api.exemplo.com/api";</script>`
   antes dos scripts de módulo (hoje o padrão é `http://localhost:3000/api`).
