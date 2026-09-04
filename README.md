# 🌱 ZeroCarbon

> Sistema para monitoramento e acompanhamento da pegada de carbono individual.

## Identificação Acadêmica

| Informação                | Detalhes                                                       |
| ------------------------- | -------------------------------------------------------------- |
| **Instituição de Ensino** | UNICEPLAC                                                      |
| **Curso**                 | Engenharia de Software                                         |
| **Disciplina**            | Projeto Integrado de Certificação em Governança e Gestão de TI |
| **Orientador**            | Profº Hudson Neves                                             |

---

## 📋 Descrição

O **ZeroCarbon** é um projeto desenvolvido com o objetivo de auxiliar usuários no **monitoramento de sua pegada de carbono**, permitindo compreender melhor o impacto ambiental causado por atividades do cotidiano.

A proposta do sistema é transformar informações relacionadas a **consumo de energia elétrica, gás e transporte** em estimativas de emissão de CO₂, apresentando os resultados de maneira visual e simplificada.

O projeto possui uma interface voltada para acompanhamento ambiental, incluindo uma página inicial de apresentação, área de autenticação, dashboard, calculadora de carbono, histórico de registros e perfil do usuário.

---

## 🎯 Objetivos

### Objetivo Geral

Desenvolver uma solução digital capaz de auxiliar usuários a **calcular, acompanhar e compreender sua pegada de carbono**, incentivando a adoção de hábitos mais sustentáveis.

### Problema que o Sistema Resolve

A dificuldade de compreender o impacto ambiental causado por atividades comuns do dia a dia, como consumo de energia, utilização de gás e transporte.

O ZeroCarbon busca apresentar essas informações de forma mais acessível, permitindo que o usuário visualize sua estimativa de emissão e acompanhe sua evolução ao longo do tempo.

### Público-alvo

Pessoas interessadas em:

* Monitorar seu impacto ambiental;
* Conhecer sua pegada de carbono;
* Acompanhar sua evolução ao longo dos meses;
* Estabelecer metas de redução de emissões;
* Adotar hábitos mais sustentáveis.

---

## ⚙️ Funcionalidades

### Landing Page

A página inicial apresenta a proposta do ZeroCarbon e disponibiliza informações sobre o funcionamento e os recursos da plataforma.

Entre os elementos apresentados estão:

* Apresentação do ZeroCarbon;
* Explicação sobre o funcionamento do sistema;
* Seção de recursos;
* Seção "Sobre";
* Acesso à área de login;
* Acesso à criação de conta.

### Cadastro e Login

O projeto apresenta interfaces destinadas à autenticação dos usuários, incluindo:

* Login;
* Cadastro;
* Campos para informações do usuário;
* Navegação entre cadastro e login.

### Dashboard

O painel do sistema apresenta informações relacionadas à pegada de carbono do usuário, permitindo visualizar indicadores e acompanhar seu progresso.

### Calculadora de Carbono

A calculadora permite informar dados de consumo para estimar a emissão de carbono.

As categorias atualmente representadas são:

* ⚡ Energia elétrica;
* 🔥 Consumo de gás;
* 🚗 Transporte.

O resultado é apresentado em **tCO₂/mês**, acompanhado de um detalhamento por categoria e de uma comparação da emissão estimada.

### Histórico

O sistema possui uma área de histórico destinada ao acompanhamento dos registros mensais.

São apresentados indicadores como:

* Redução acumulada;
* Melhor mês;
* Meta anual;
* Registros mensais;
* Evolução da pegada de carbono.

### Perfil

A área de perfil permite visualizar informações do usuário e indicadores relacionados às suas metas e conquistas.

A interface apresenta:

* Informações do usuário;
* Localização;
* Foto de perfil;
* Conquistas;
* Meta anual;
* Informações da conta;
* Configurações de notificações.

### Tema da Interface

A aplicação também possui suporte à alternância entre os temas **claro e escuro**.

---

## 💻 Tecnologias Utilizadas

Com base nos arquivos atualmente presentes no repositório, o projeto utiliza tecnologias voltadas ao desenvolvimento web:

* **HTML5** — estrutura das páginas;
* **CSS3** — estilização e responsividade;
* **JavaScript** — interatividade e lógica da aplicação;
* **Google Fonts** — utilização das fontes Poppins, Inter, Space Grotesk e IBM Plex Mono.

### Bibliotecas e Frameworks

**A ser definido pela equipe.**

O repositório analisado não apresenta, atualmente, um framework de desenvolvimento web identificado como dependência do projeto.

---

## 🏗️ Arquitetura da Solução

O projeto atualmente apresenta uma arquitetura baseada em **aplicação web no lado do cliente (frontend)**.

A estrutura do repositório contém diferentes arquivos e diretórios relacionados às interfaces do sistema, incluindo:

* `FrontEnd/`
* `LandingPage/`
* `index.html`
* `ZeroCarbon.html`

O arquivo `ZeroCarbon.html` concentra uma implementação de interface que reúne as principais telas do sistema, com navegação entre páginas utilizando JavaScript.

### Fluxo conceitual

```text
                 ┌───────────────────┐
                 │    Usuário         │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │   Landing Page    │
                 └─────────┬─────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
          ┌───────────┐         ┌───────────┐
          │   Login   │         │  Cadastro │
          └─────┬─────┘         └─────┬─────┘
                │                     │
                └──────────┬──────────┘
                           ▼
                 ┌───────────────────┐
                 │     Dashboard     │
                 └─────────┬─────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌───────────┐  ┌───────────┐  ┌───────────┐
      │Calculadora│  │ Histórico  │  │  Perfil   │
      └───────────┘  └───────────┘  └───────────┘
```

---

## 🗄️ Modelagem do Banco de Dados

### Banco de Dados

**A ser definido pela equipe.**

Na versão atualmente presente no repositório, não foi identificado um banco de dados ou uma camada de persistência de dados implementada.

### Modelo de Dados

**A ser definido pela equipe.**

---

## 📦 Pré-requisitos

Para executar a versão atual do projeto, são necessários:

* Navegador web moderno;
* Acesso aos arquivos do projeto.

**A ser definido pela equipe:** requisitos adicionais para futuras versões do sistema.

---

## 🔧 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/ProjetoZeroCarbon/ZeroCarbon.git
```

### 2. Acessar o diretório

```bash
cd ZeroCarbon
```

### 3. Executar a aplicação

Como a implementação atual é composta por arquivos HTML, CSS e JavaScript, os arquivos podem ser abertos diretamente em um navegador.

> **Observação:** a configuração de um servidor local ou processo de build será definida pela equipe caso seja adotada uma arquitetura diferente nas próximas versões.

---

## ▶️ Como Executar

Após clonar o projeto, abra o arquivo:

```text
index.html
```

em um navegador web.

Também existe no repositório uma implementação da aplicação em:

```text
ZeroCarbon.html
```

A implementação do `ZeroCarbon.html` contém navegação entre Landing Page, Login, Cadastro, Dashboard, Calculadora, Histórico e Perfil.

---

## 📁 Estrutura do Projeto

A estrutura atualmente identificada no repositório é:

```text
ZeroCarbon/
│
├── FrontEnd/
│   └── index.html
│
├── LandingPage/
│   ├── index.html
│   └── index.js
│
├── ZeroCarbon.html
├── index.html
├── LICENSE
└── README.md
```

A estrutura acima corresponde aos arquivos e diretórios atualmente disponibilizados no repositório.

---

## 🧮 Funcionamento da Calculadora

A calculadora utiliza os valores informados pelo usuário para realizar uma estimativa de emissão.

Na implementação atual, são utilizados fatores para:

* Energia elétrica;
* Gás;
* Transporte.

O cálculo é realizado em JavaScript e o resultado é convertido para toneladas de CO₂ por mês.

### Exemplo

Considerando os dados inseridos pelo usuário:

```text
Consumo de energia: 250 kWh
Consumo de gás:     valor informado pelo usuário
Distância:          valor informado pelo usuário
Combustível:        opção selecionada
```

O sistema calcula a emissão estimada e apresenta:

```text
Pegada estimada
tCO₂/mês
```

Além disso, o sistema apresenta um detalhamento das emissões por categoria.

---

## 🔌 API

**A ser definido pela equipe.**

Não foi identificada uma API externa ou uma API própria implementada na versão atual do projeto.

---

## 🖼️ Capturas de Tela

### Landing Page

> **Inserir aqui uma captura de tela da Landing Page.**

### Login

> **Inserir aqui uma captura de tela da tela de Login.**

### Cadastro

> **Inserir aqui uma captura de tela da tela de Cadastro.**

### Dashboard

> **Inserir aqui uma captura de tela do Dashboard.**

### Calculadora de Carbono

> **Inserir aqui uma captura de tela da Calculadora de Carbono.**

### Histórico

> **Inserir aqui uma captura de tela da tela de Histórico.**

### Perfil

> **Inserir aqui uma captura de tela da tela de Perfil.**

---

## 👥 Equipe do Projeto

| Integrante                 | Função                     |
| -------------------------- | -------------------------- |
| A ser definido pela equipe | A ser definido pela equipe |
| A ser definido pela equipe | A ser definido pela equipe |
| A ser definido pela equipe | A ser definido pela equipe |
| A ser definido pela equipe | A ser definido pela equipe |

---

## 🚧 Status do Projeto

**Em desenvolvimento.**

O repositório encontra-se em desenvolvimento e atualmente conta com uma implementação de interface contendo Landing Page, autenticação, dashboard, calculadora, histórico e perfil. O repositório possui atualmente 9 commits e está publicado como projeto público.

---

## 🔮 Melhorias Futuras

As seguintes melhorias podem ser incorporadas ao projeto conforme a evolução da solução:

* Implementação de persistência dos dados dos usuários;
* Implementação de banco de dados;
* Implementação efetiva do sistema de autenticação;
* Armazenamento dos cálculos realizados;
* Integração entre frontend e backend;
* Desenvolvimento de uma API;
* Implementação de histórico real por usuário;
* Implementação de metas personalizadas;
* Implementação de notificações;
* Aprimoramento dos gráficos de acompanhamento;
* Expansão das categorias utilizadas no cálculo da pegada de carbono;
* Implementação de recomendações personalizadas para redução das emissões;
* Melhorias de acessibilidade e experiência do usuário.

---

## 📄 Licença

Este projeto está disponibilizado sob a licença **MIT**.

Consulte o arquivo [`LICENSE`](./LICENSE) para obter os termos completos da licença.

---

## 📚 Repositório

O código-fonte do projeto está disponível no GitHub:

**ProjetoZeroCarbon/ZeroCarbon**

Repositório desenvolvido para a disciplina de **Projeto Integrado de Certificação em Governança e Gestão de TI**.
