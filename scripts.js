const pages = document.querySelectorAll(".page");

function showPage(id) {
  pages.forEach(page => {
    page.classList.toggle("active", page.id === id);
  });

  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelectorAll("[data-goto]").forEach(element => {
  element.addEventListener("click", event => {
    event.preventDefault();
    showPage(element.dataset.goto);
  });
});


// =========================================================
// TEMA
// =========================================================

const root = document.documentElement;

function updateThemeButtons(theme) {
  document.querySelectorAll("[data-theme-button]").forEach(button => {
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
    );

    button.title = theme === "dark" ? "Modo claro" : "Modo escuro";
  });
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("zerocarbon-theme", theme);
  updateThemeButtons(theme);
}

const savedTheme = localStorage.getItem("zerocarbon-theme");
setTheme(savedTheme === "dark" ? "dark" : "light");

document.querySelectorAll("#themeToggle, [data-theme-button]").forEach(button => {
  button.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
});


// =========================================================
// CALCULADORA DE PEGADA DE CARBONO
// =========================================================

function runCalc() {
  const kwhInput = document.getElementById("c-kwh");
  const gasInput = document.getElementById("c-gas");
  const kmInput = document.getElementById("c-km");

  const kwh = parseFloat(kwhInput.value);
  const gas = parseFloat(gasInput.value);
  const km = parseFloat(kmInput.value);

  const selectedFuel = document.querySelector("#fuelGroup input:checked");

  // Verifica se todos os campos foram preenchidos
  if (isNaN(kwh) || isNaN(gas) || isNaN(km)) {
    alert("Preencha todos os campos para calcular sua pegada de carbono.");
    return;
  }

  // Verifica se os valores são válidos
  if (kwh < 0 || gas < 0 || km < 0) {
    alert("Os valores não podem ser negativos.");
    return;
  }

  // Verifica se um combustível foi selecionado
  if (!selectedFuel) {
    alert("Selecione o tipo de combustível.");
    return;
  }

  const fuelFactor = parseFloat(selectedFuel.value);

  // Fatores de emissão
  const eletKg = kwh * 0.0817;
  const gasKg = gas * 2.02;
  const transpKg = km * fuelFactor;

  // Total em toneladas
  const totalT = (eletKg + gasKg + transpKg) / 1000;

  // Atualiza os resultados
  document.getElementById("calcElet").textContent =
    (eletKg / 1000).toFixed(2) + " t";

  document.getElementById("calcGas").textContent =
    (gasKg / 1000).toFixed(2) + " t";

  document.getElementById("calcTransp").textContent =
    (transpKg / 1000).toFixed(2) + " t";

  document.getElementById("calcTotal").innerHTML =
    totalT.toFixed(2) + ' <span>tCO₂/mês</span>';

  const tanks = Math.round((totalT * 12) / 0.65);

  document.getElementById("calcCompare").textContent =
    "Isso equivale a cerca de " +
    tanks +
    " tanques de gás de cozinha por ano.";

  // Mostra o resultado somente depois do cálculo
  document.querySelector(".calc-preview").style.display = "block";
}


// =========================================================
// BOTÃO CALCULAR
// =========================================================

document.getElementById("calcBtn").addEventListener("click", runCalc);


// =========================================================
// SELEÇÃO DO COMBUSTÍVEL
// =========================================================

document.querySelectorAll("#fuelGroup .radio-opt").forEach(option => {
  option.addEventListener("click", () => {
    document
      .querySelectorAll("#fuelGroup .radio-opt")
      .forEach(item => item.classList.remove("checked"));

    option.classList.add("checked");

    const radio = option.querySelector("input");
    radio.checked = true;
  });
});

/* =========================================================
   CADASTRO E LOGIN
   ========================================================= */

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");


// ---------- CADASTRO ----------

if (signupBtn) {
  signupBtn.addEventListener("click", () => {

    const nome = document.getElementById("s-nome").value.trim();
    const sobrenome = document.getElementById("s-sobrenome").value.trim();
    const nascimento = document.getElementById("s-nasc").value.trim();
    const estado = document.getElementById("s-estado").value;
    const email = document.getElementById("s-email").value.trim();
    const senha = document.getElementById("s-senha").value;
    const idUsuario = document.getElementById("s-id").value.trim();

    // Validação do nome
    if (nome.length < 2) {
      alert("Digite um nome válido.");
      return;
    }

    // Validação do sobrenome
    if (sobrenome.length < 2) {
      alert("Digite um sobrenome válido.");
      return;
    }

    // Validação da data
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!dataRegex.test(nascimento)) {
      alert("Digite a data de nascimento no formato DD/MM/AAAA.");
      return;
    }

    // Validação do estado
    if (estado.length < 2) {
  alert("Digite seu estado ou cidade.");
  return;
}

    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Digite um e-mail válido.");
      return;
    }

    // Validação da senha
    if (senha.length < 8) {
      alert("A senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    // Validação do ID
    if (idUsuario.length < 3) {
      alert("O ID de usuário deve possuir pelo menos 3 caracteres.");
      return;
    }

    // Verifica se já existe uma conta
    const contaExistente = localStorage.getItem("zerocarbon-user");

    if (contaExistente) {
      const conta = JSON.parse(contaExistente);

      if (
        conta.idUsuario.toLowerCase() === idUsuario.toLowerCase() ||
        conta.email.toLowerCase() === email.toLowerCase()
      ) {
        alert("Já existe uma conta com esse ID ou e-mail.");
        return;
      }
    }

    // Cria a conta
    const usuario = {
      nome: nome,
      sobrenome: sobrenome,
      nascimento: nascimento,
      estado: estado,
      email: email,
      senha: senha,
      idUsuario: idUsuario
    };

    // Salva os dados
    localStorage.setItem("zerocarbon-user", JSON.stringify(usuario));

    // Salva o usuário como logado
    localStorage.setItem("zerocarbon-logged", "true");

    // Atualiza os dados exibidos no sistema
    atualizarUsuario(usuario);

    alert("Conta criada com sucesso!");

    showPage("page-dashboard");
  });
}


// ---------- LOGIN ----------

if (loginBtn) {
  loginBtn.addEventListener("click", () => {

    const usuarioDigitado = document.getElementById("l-user").value.trim();
    const senhaDigitada = document.getElementById("l-pass").value;

    if (!usuarioDigitado || !senhaDigitada) {
      alert("Preencha o usuário e a senha.");
      return;
    }

    const dadosSalvos = localStorage.getItem("zerocarbon-user");

    if (!dadosSalvos) {
      alert("Nenhuma conta cadastrada. Crie uma conta primeiro.");
      return;
    }

    const usuario = JSON.parse(dadosSalvos);

    const usuarioCorreto =
      usuarioDigitado.toLowerCase() === usuario.idUsuario.toLowerCase() ||
      usuarioDigitado.toLowerCase() === usuario.email.toLowerCase();

    const senhaCorreta =
      senhaDigitada === usuario.senha;

    if (!usuarioCorreto || !senhaCorreta) {
      alert("Usuário ou senha incorretos.");
      return;
    }

    localStorage.setItem("zerocarbon-logged", "true");

    atualizarUsuario(usuario);

    alert("Login realizado com sucesso!");

    showPage("page-dashboard");
  });
}


// ---------- ATUALIZA OS DADOS DO USUÁRIO NO SISTEMA ----------

function atualizarUsuario(usuario) {

  const nomeCompleto =
    `${usuario.nome} ${usuario.sobrenome}`;

  // Nome na barra lateral
  document.querySelectorAll(".side-user .who").forEach(element => {
    element.textContent = nomeCompleto;
  });

  // ID na barra lateral
  document.querySelectorAll(".side-user .sub").forEach(element => {
    element.textContent = usuario.idUsuario;
  });

  // Saudação do dashboard
  const dashboardTitulo =
    document.querySelector("#page-dashboard .app-topbar h1");

  if (dashboardTitulo) {
    dashboardTitulo.textContent =
      `Olá, ${usuario.nome} 👋`;
  }

  const dashboardDate =
  document.getElementById("dashboardDate");

if (dashboardDate) {
  const dataAtual = new Date();

  const mes = dataAtual.toLocaleDateString("pt-BR", {
    month: "long"
  });

  const ano = dataAtual.getFullYear();

  const mesFormatado =
    mes.charAt(0).toUpperCase() + mes.slice(1);

  dashboardDate.textContent =
    `Seu painel ambiental — ${mesFormatado} ${ano}`;
}

  // Nome no perfil
  const profileName =
    document.querySelector("#page-profile .profile-card h3");

  if (profileName) {
    profileName.textContent = nomeCompleto;
  }

  // Informações abaixo do nome no perfil
  const profileLocation =
    document.querySelector("#page-profile .profile-card .loc");

  if (profileLocation) {
    profileLocation.textContent =
      `${usuario.idUsuario} · ${usuario.estado}`;
  }

  // E-mail no perfil
  const emailRows =
    document.querySelectorAll("#page-profile .settings-row");

  emailRows.forEach(row => {

    const label = row.querySelector(".k");

    if (label && label.textContent.trim() === "E-mail") {
      const value = row.querySelector(".v");

      if (value) {
        value.textContent = usuario.email;
      }
    }

  });
}


// ---------- CARREGA O USUÁRIO SALVO ----------

const usuarioSalvo =
  localStorage.getItem("zerocarbon-user");

const usuarioLogado =
  localStorage.getItem("zerocarbon-logged");

if (usuarioSalvo && usuarioLogado === "true") {

  const usuario = JSON.parse(usuarioSalvo);

  atualizarUsuario(usuario);
}

/* =========================================================
   FOTO DE PERFIL
   ========================================================= */

const changePhotoBtn = document.getElementById("changePhotoBtn");
const profilePhotoInput = document.getElementById("profilePhotoInput");

if (changePhotoBtn && profilePhotoInput) {

  // Abre o seletor de arquivos
  changePhotoBtn.addEventListener("click", () => {
    profilePhotoInput.click();
  });

  // Quando o usuário escolher uma imagem
  profilePhotoInput.addEventListener("change", () => {

    const file = profilePhotoInput.files[0];

    if (!file) {
      return;
    }

    // Verifica se é uma imagem
    if (!file.type.startsWith("image/")) {
      alert("Selecione uma imagem válida.");
      return;
    }

    // Limita o tamanho para evitar problemas no localStorage
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      const photo = reader.result;

      // Salva a foto no navegador
      localStorage.setItem("zerocarbon-profile-photo", photo);

      // Atualiza todas as fotos do usuário
      updateProfilePhoto(photo);
    };

    reader.readAsDataURL(file);
  });
}


/* ---------- ATUALIZA A FOTO ---------- */

function updateProfilePhoto(photo) {

  // Foto grande do perfil
  document.querySelectorAll(".avatar-lg").forEach(avatar => {
    avatar.style.backgroundImage = `url("${photo}")`;
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundRepeat = "no-repeat";
  });

  // Foto pequena da barra lateral
  document.querySelectorAll(".avatar").forEach(avatar => {
    avatar.style.backgroundImage = `url("${photo}")`;
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundRepeat = "no-repeat";
  });
}


/* ---------- CARREGA A FOTO SALVA ---------- */

const savedProfilePhoto =
  localStorage.getItem("zerocarbon-profile-photo");

if (savedProfilePhoto) {
  updateProfilePhoto(savedProfilePhoto);
}

const nascimentoInput = document.getElementById("s-nasc");

if (nascimentoInput) {
  nascimentoInput.addEventListener("input", () => {
    let valor = nascimentoInput.value.replace(/\D/g, "");

    if (valor.length > 2) {
      valor = valor.slice(0, 2) + "/" + valor.slice(2);
    }

    if (valor.length > 5) {
      valor = valor.slice(0, 5) + "/" + valor.slice(5);
    }

    nascimentoInput.value = valor.slice(0, 10);
  });
}