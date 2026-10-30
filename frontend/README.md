# ZeroCarbon — Frontend

Nova identidade visual (tema natureza: floresta, folhagem, água) e código
separado por responsabilidade, em vez de um único `index.html` monolítico.

## Estrutura

```
frontend/
├── index.html        # Landing page
├── login.html         # Autenticação — entrar
├── signup.html        # Autenticação — cadastro
├── dashboard.html      # Painel principal (área logada)
├── calculator.html    # Calculadora de pegada de carbono
├── history.html       # Histórico mensal
├── profile.html        # Perfil do usuário
├── css/
│   ├── base.css        # tokens de cor/tipografia + reset
│   ├── components.css  # botões, cards, inputs, sidebar (reuso entre páginas)
│   ├── landing.css      # estilos exclusivos da landing
│   ├── auth.css        # estilos de login/cadastro
│   └── app.css         # estilos da área logada (dashboard/calc/histórico/perfil)
└── js/
    ├── api.js          # única camada de comunicação com o backend
    ├── theme.js         # alternância claro/escuro
    ├── nav.js           # navegação da área logada + proteção de rota
    ├── auth.js          # lógica de login/cadastro
    ├── calculator.js    # lógica da calculadora
    ├── dashboard.js      # busca e renderiza o resumo do painel
    ├── history.js        # busca e renderiza o histórico
    └── profile.js        # busca e atualiza o perfil
```

## Como rodar localmente

Como agora o frontend consome uma API (veja `/backend`), sirva os arquivos
com um servidor estático simples (não abra o `index.html` direto com
`file://`, pois módulos ES e `fetch` exigem `http://`):

```bash
cd frontend
npx serve .
# ou: python3 -m http.server 5500
```

Por padrão, o frontend chama a API em `http://localhost:3000/api`.
Para apontar para outra URL, defina antes dos scripts, em qualquer página:

```html
<script>window.ZEROCARBON_API_URL = "https://minha-api.exemplo.com/api";</script>
```

## Imagens

As imagens de natureza usadas no layout vêm do Unsplash via URL direta
(sem necessidade de baixar arquivos). Troque pelas fotos oficiais do projeto
quando quiser — os pontos de troca estão em `css/landing.css`, `css/auth.css`
e nos `<img>` do `index.html`.
