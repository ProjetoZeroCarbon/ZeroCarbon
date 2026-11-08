# 🌱 ZeroCarbon

> Sistema web para monitoramento e acompanhamento da pegada de carbono individual.

## Identificação Acadêmica

| Informação                | Detalhes                                                       |
| ------------------------- | -------------------------------------------------------------- |
| **Instituição de Ensino** | UNICEPLAC                                                      |
| **Curso**                 | Engenharia de Software                                         |
| **Disciplina**            | Projeto Integrado de Certificação em Governança e Gestão de TI |
| **Orientador**            | Profº Hudson Neves                                             |

---

## 📋 Descrição

O **ZeroCarbon** auxilia usuários no **monitoramento de sua pegada de carbono**, permitindo compreender melhor o impacto ambiental causado por atividades do cotidiano.

O sistema transforma informações de **consumo de energia elétrica, gás e transporte** em estimativas de emissão de CO₂ (em tCO₂/mês), guarda cada cálculo no histórico do usuário e apresenta os resultados de forma visual e simplificada.

A aplicação é composta por um **frontend estático** (HTML, CSS e JavaScript), uma **API REST** em Node.js e um **banco de dados MySQL compatível** (TiDB Cloud), com contas de usuário e autenticação por token JWT.

---

## 🎯 Objetivos

### Objetivo Geral

Desenvolver uma solução digital capaz de auxiliar usuários a **calcular, acompanhar e compreender sua pegada de carbono**, incentivando a adoção de hábitos mais sustentáveis.

### Problema que o Sistema Resolve

A dificuldade de compreender o impacto ambiental causado por atividades comuns do dia a dia, como consumo de energia, uso de gás e transporte.

O ZeroCarbon apresenta essas informações de forma acessível, permitindo que o usuário visualize sua estimativa de emissão e acompanhe sua evolução ao longo do tempo.

### Público-alvo

Pessoas interessadas em:

- Monitorar seu impacto ambiental;
- Conhecer sua pegada de carbono;
- Acompanhar sua evolução ao longo dos meses;
- Estabelecer metas de redução de emissões;
- Adotar hábitos mais sustentáveis.

---

## ⚙️ Funcionalidades

### ✅ Disponíveis

**Landing Page**
Apresentação do ZeroCarbon, explicação do funcionamento, seção de recursos, seção "Sobre" e acesso ao login e ao cadastro.

**Cadastro e Login**
Criação de conta (nome, sobrenome, data de nascimento, estado/cidade, e-mail, senha e ID de usuário) e login por usuário ou e-mail. A senha é armazenada com hash (bcrypt) e a sessão usa token JWT. As rotas de autenticação têm limite de tentativas.

**Calculadora de Carbono**
Estima a emissão a partir de três categorias:

- ⚡ Energia elétrica (kWh);
- 🔥 Gás (m³);
- 🚗 Transporte (km e tipo de combustível: gasolina, álcool ou diesel).

O resultado é exibido em **tCO₂/mês**, com detalhamento por categoria e uma comparação da emissão estimada. Cada cálculo é salvo no histórico do usuário.

**Dashboard**
Mostra o total do mês, a variação em relação ao mês anterior e o progresso da meta mensal do usuário.

**Histórico**
Lista os cálculos do usuário, do mais recente para o mais antigo, com a variação percentual em relação ao cálculo anterior.

**Perfil**
Visualização e edição de nome, sobrenome, localização e e-mail, além de envio e remoção da foto de perfil.

**Tema da Interface**
Alternância entre os temas **claro e escuro**.

### 🚧 Em desenvolvimento

- Meta mensal editável pelo usuário (o campo já existe no banco);
- Dashboard com dados 100% reais (alguns blocos ainda são fixos na interface: impacto por categoria, gráfico de evolução mensal e dica do mês);
- Conquistas e configurações de notificações no perfil (hoje apenas na interface);
- Recuperação de senha e função "Lembrar de mim" (presentes na interface, ainda sem funcionamento).

---

## 💻 Tecnologias Utilizadas

### Frontend

- **HTML5**: estrutura das páginas;
- **CSS3**: estilização, responsividade e tema claro/escuro;
- **JavaScript (ES Modules)**: lógica da aplicação e comunicação com a API;
- **Google Fonts**: Poppins, Inter, Space Grotesk e IBM Plex Mono.

### Backend

- **Node.js** (≥ 18) e **Express 5**: API REST;
- **mysql2**: acesso ao banco de dados;
- **jsonwebtoken** e **bcryptjs**: autenticação e hash de senhas;
- **helmet**, **cors** e **express-rate-limit**: segurança, CORS e limite de requisições;
- **dotenv**: variáveis de ambiente.

### Infraestrutura

- **TiDB Cloud (Starter)**: banco MySQL compatível;
- **Vercel**: hospedagem da API e do frontend.

---

## 🏗️ Arquitetura da Solução

O projeto segue uma arquitetura em três camadas:

```
        ┌──────────────────────────┐
        │   Frontend (estático)    │   HTML + CSS + JavaScript
        └────────────┬─────────────┘
                     │  HTTPS / JSON  (token JWT)
                     ▼
        ┌──────────────────────────┐
        │   API REST (Express)     │   /api/*  (Vercel)
        └────────────┬─────────────┘
                     │  MySQL (SSL)
                     ▼
        ┌──────────────────────────┐
        │  Banco de dados (TiDB)   │   users · carbon_records · user_avatars
        └──────────────────────────┘
```

### Fluxo de navegação

```
                 ┌───────────────────┐
                 │      Usuário      │
                 └─────────┬─────────┘
                           ▼
                 ┌───────────────────┐
                 │   Landing Page    │
                 └─────────┬─────────┘
                ┌──────────┴──────────┐
                ▼                     ▼
          ┌───────────┐         ┌───────────┐
          │   Login   │         │  Cadastro │
          └─────┬─────┘         └─────┬─────┘
                └──────────┬──────────┘
                           ▼
                 ┌───────────────────┐
                 │     Dashboard     │
                 └─────────┬─────────┘
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌───────────┐  ┌───────────┐  ┌───────────┐
      │Calculadora│  │ Histórico │  │  Perfil   │
      └───────────┘  └───────────┘  └───────────┘
```

---

## 🗄️ Modelagem do Banco de Dados

Banco **MySQL** (compatível com TiDB Cloud). O script completo está em [`backend/sql/schema.sql`](./backend/sql/schema.sql).

| Tabela           | Descrição                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `users`          | Dados da conta: usuário, e-mail, hash da senha, nome, data de nascimento, localização e meta mensal |
| `carbon_records` | Um registro por cálculo: consumo informado e emissões (energia, gás, transporte e total, em tCO₂)   |
| `user_avatars`   | Foto de perfil (uma por usuário, reduzida para 256×256 antes do envio)                              |

**Relacionamentos:** `carbon_records.user_id` e `user_avatars.user_id` referenciam `users.id` com exclusão em cascata.

---

## 🔌 API

A API fica sob o prefixo `/api`. As rotas marcadas com 🔒 exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota                | Descrição                                      |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | `/health`           | Verifica se a API e o banco estão no ar        |
| POST   | `/auth/register`    | Cria uma conta                                 |
| POST   | `/auth/login`       | Autentica e devolve o token JWT                |
| GET    | `/profile` 🔒       | Dados do usuário logado                        |
| PUT    | `/profile` 🔒       | Atualiza nome, sobrenome, localização e e-mail |
| PUT    | `/profile/avatar` 🔒    | Envia ou substitui a foto de perfil        |
| DELETE | `/profile/avatar` 🔒    | Remove a foto de perfil                    |
| POST   | `/calculator` 🔒    | Calcula a emissão e salva no histórico         |
| GET    | `/history` 🔒       | Lista os cálculos do usuário                   |
| GET    | `/history/summary` 🔒 | Resumo usado no dashboard                    |

---

## 🧮 Funcionamento da Calculadora

O cálculo é feito **no backend** (`backend/src/utils/emissions.js`), que valida os valores recebidos e grava o resultado.

| Categoria        | Fator de emissão                                               |
| ---------------- | -------------------------------------------------------------- |
| Energia elétrica | 0,0817 kg CO₂ por kWh                                          |
| Gás              | 2,02 kg CO₂ por m³                                             |
| Transporte       | 0,192 (gasolina), 0,030 (álcool) ou 0,212 (diesel) kg CO₂ por km |

O resultado é convertido para toneladas (tCO₂) e arredondado em 4 casas decimais.

### Exemplo

```
Energia elétrica:  250 kWh   → 250 × 0,0817 / 1000 = 0,0204 tCO₂
Gás:               10 m³     → 10  × 2,02   / 1000 = 0,0202 tCO₂
Transporte:        100 km (gasolina) → 100 × 0,192 / 1000 = 0,0192 tCO₂
────────────────────────────────────────────────────────────
Pegada estimada:   0,0598 tCO₂/mês
```

---

## 📦 Pré-requisitos

- **Node.js 18 ou superior** e npm;
- Um banco **MySQL** (local) ou um cluster no **TiDB Cloud**;
- Navegador web moderno;
- (Opcional) conta na **Vercel** para publicar.

---

## 🔧 Instalação e Execução Local

### 1. Clonar o repositório

```bash
git clone https://github.com/ProjetoZeroCarbon/ZeroCarbon.git
cd ZeroCarbon
```

### 2. Configurar o backend

```bash
cd backend
cp .env.example .env
```

Preencha o arquivo **`backend/.env`** (na pasta `backend`, ao lado do `package.json`, e não dentro de `src`):

| Variável         | Descrição                                                           |
| ---------------- | ------------------------------------------------------------------- |
| `PORT`           | Porta da API (padrão `3000`)                                        |
| `DB_HOST`        | Endereço do banco                                                   |
| `DB_PORT`        | Porta do banco (`3306` no MySQL, `4000` no TiDB Cloud)              |
| `DB_USER`        | Usuário do banco                                                    |
| `DB_PASSWORD`    | Senha do banco                                                      |
| `DB_NAME`        | Nome do banco (por exemplo, `zerocarbon`; evite bancos de sistema)  |
| `DB_SSL`         | `true` em bancos hospedados, como o TiDB Cloud                      |
| `JWT_SECRET`     | Segredo longo e aleatório (obrigatório)                             |
| `JWT_EXPIRES_IN` | Validade do token (padrão `7d`)                                     |
| `CORS_ORIGINS`   | Endereços do frontend, separados por vírgula, sem barra no final    |
| `APP_TIMEZONE`   | Fuso usado para decidir o mês atual (padrão `America/Sao_Paulo`)    |

Para gerar um `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Criar as tabelas e iniciar a API

```bash
npm install
npm run db:migrate   # cria o banco (se não existir) e as tabelas
npm run dev          # inicia a API em http://localhost:3000
```

Teste em `http://localhost:3000/api/health`. O esperado é `{"status":"ok","database":"up"}`.

### 4. Abrir o frontend

Sirva a raiz do projeto com um servidor estático (por exemplo, a extensão Live Server do VS Code, na porta 5500) e abra `index.html`. Em `localhost`, o frontend usa automaticamente a API em `http://localhost:3000/api`.

---

## ☁️ Deploy

O projeto é publicado em dois projetos na **Vercel**, usando o mesmo repositório, com o banco no **TiDB Cloud**:

| Projeto  | Root Directory | Observações                                                                              |
| -------- | -------------- | ---------------------------------------------------------------------------------------- |
| Backend  | `backend`      | Variáveis de ambiente cadastradas na Vercel; a função serverless está em `api/index.js`  |
| Frontend | raiz           | Em `frontend/js/api.js`, `PRODUCTION_API_URL` aponta para a API e termina em `/api`      |

O passo a passo completo está em [`DEPLOY.md`](./DEPLOY.md). Pontos que mais causam erro:

- A URL da API em `api.js` termina em `/api`, com **uma barra só** (`.../api`, e não `...//api`);
- `CORS_ORIGINS` na API precisa conter o endereço exato do frontend, e a API precisa de novo deploy depois de mudar variáveis;
- `DB_NAME` na Vercel deve ser o mesmo banco onde `npm run db:migrate` criou as tabelas.

### 🔐 Segurança

- **Nunca** envie o `backend/.env` ao Git (ele já está no `.gitignore`);
- Use senha de banco e `JWT_SECRET` próprios e troque-os se algum dia forem expostos;
- Senhas dos usuários são armazenadas apenas como hash.

---

## 📁 Estrutura do Projeto

```
ZeroCarbon/
│
├── index.html                # Landing page
├── vercel.json               # Configuração do frontend na Vercel
├── package.json
├── DEPLOY.md                 # Guia de publicação
├── LICENSE
├── README.md
│
├── frontend/
│   ├── login.html · signup.html · dashboard.html
│   ├── calculator.html · history.html · profile.html
│   ├── css/
│   ├── assets/
│   └── js/                   # api.js, auth.js, calculator.js, dashboard.js,
│                             # history.js, profile.js, nav.js, theme.js, ...
│
├── backend/
│   ├── api/index.js          # Entrada serverless (Vercel)
│   ├── vercel.json
│   ├── package.json
│   ├── sql/schema.sql        # Estrutura do banco
│   └── src/
│       ├── app.js · server.js
│       ├── config/           # env.js, db.js
│       ├── controllers/      # auth, calculator, history, profile, avatar
│       ├── middleware/       # autenticação, erros
│       ├── routes/
│       ├── scripts/migrate.js
│       └── utils/            # emissions.js, dates.js, ...
│
├── Docs/                     # Relatório parcial, casos de uso e cronograma
└── Certificados SCRUM/
```

---

## 📚 Documentação

Os documentos acadêmicos do projeto ficam na pasta [`Docs/`](./Docs):

- Relatório parcial atualizado (Calculadora & Hub de Pegada de Carbono);
- Casos de uso;
- Cronograma.

---

## 👥 Equipe do Projeto

| Integrante      | Função                |
| --------------- | --------------------- |
| Kauã Nascimento | Scrum Master + Dev    |
| Denzel Luiz     | UI/UX Design + Dev    |
| Maria Eduarda   | UI/UX Design          |
| Ícaro Scárdua   | Dev + Tech Lead       |
| Daniel Victor   | QA + Tech Writer      |
| Breno Aguiar    | Tech Writer + Relatório |
| Arhur Luan      | Tech Writer + README  |
| Rodrigo Alves   | QA + Tech Writer      |
| Antônio Souza   | Tech Lead + Dev       |

---

## 🚧 Status do Projeto

**Em desenvolvimento.**

O sistema já está publicado e funcional, com cadastro e login reais, calculadora com persistência, histórico por usuário, perfil com foto e dashboard conectado ao banco de dados. As próximas entregas estão listadas abaixo.

---

## 🔮 Melhorias Futuras

- Meta mensal e anual editáveis pelo usuário;
- Dashboard totalmente alimentado por dados reais (categorias, evolução mensal e dicas);
- Conquistas e preferências de notificação salvas por usuário;
- Recuperação de senha e opção "Lembrar de mim";
- Edição e exclusão de registros do histórico;
- Exportação do histórico (CSV/PDF);
- Expansão das categorias do cálculo (alimentação, resíduos e água);
- Recomendações personalizadas para redução das emissões;
- Testes automatizados e integração contínua (CI);
- Melhorias de acessibilidade e experiência do usuário.

---

## 📄 Licença

Este projeto está disponibilizado sob a licença **MIT**.

Consulte o arquivo [`LICENSE`](./LICENSE) para obter os termos completos.

---

## 📚 Repositório

O código-fonte está disponível no GitHub: **ProjetoZeroCarbon/ZeroCarbon**

Repositório desenvolvido para a disciplina de **Projeto Integrado de Certificação em Governança e Gestão de TI**.
