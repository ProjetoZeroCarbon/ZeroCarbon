# Deploy do ZeroCarbon (Vercel + TiDB Cloud)

## 1. Banco (TiDB Cloud Starter, MySQL compatível)
1. Crie o cluster Starter em tidbcloud.com e clique em **Connect**.
2. Gere a senha e anote: host, porta (4000), usuário completo e nome do banco.
3. Em `backend/`, copie `.env.example` para `.env` e preencha (com `DB_SSL=true`).
4. `npm install` e `npm run db:migrate` para criar as tabelas.
5. `npm run dev` e abra `http://localhost:3000/api/health` (esperado: status ok, database up).

## 2. Backend na Vercel
- Novo projeto com **Root Directory = `backend`**.
- Em Settings → Environment Variables (Production), cadastre:
  `JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
  `DB_NAME`, `DB_SSL=true`, `CORS_ORIGINS`, `APP_TIMEZONE`.
- Redeploy e teste `https://SEU-BACKEND.vercel.app/api/health`.

## 3. Frontend na Vercel
- Outro projeto com o mesmo repositório e **Root Directory = raiz** (onde está o `index.html`).
- Em `frontend/js/api.js`, troque `https://SUA-API.vercel.app/api` pela URL do backend (terminando em `/api`).
- Coloque o endereço do frontend em `CORS_ORIGINS` do backend (sem barra no final) e faça Redeploy do backend.

## Segurança
- Nunca versione o `.env`. Use senha e `JWT_SECRET` novos (os antigos ficaram expostos no repositório).
