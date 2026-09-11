const pages = document.querySelectorAll(".page");

function showPage(id){
  pages.forEach(page => {
    page.classList.toggle("active", page.id === id);
  });
  window.scrollTo({top:0, behavior:"instant"});
}

document.querySelectorAll("[data-goto]").forEach(element => {
  element.addEventListener("click", event => {
    event.preventDefault();
    showPage(element.dataset.goto);
  });
});


const root = document.documentElement;

function updateThemeButtons(theme){
  document.querySelectorAll("[data-theme-button]").forEach(button => {
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
    );
    button.title = theme === "dark" ? "Modo claro" : "Modo escuro";
  });
}

function setTheme(theme){
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


function runCalc(){
  const kwh = parseFloat(document.getElementById("c-kwh").value) || 0;
  const gas = parseFloat(document.getElementById("c-gas").value) || 0;
  const km = parseFloat(document.getElementById("c-km").value) || 0;
  const selectedFuel = document.querySelector("#fuelGroup input:checked");
  const fuelFactor = selectedFuel ? parseFloat(selectedFuel.value) : 0;

  const eletKg = kwh * 0.0817;
  const gasKg = gas * 2.02;
  const transpKg = km * fuelFactor;
  const totalT = (eletKg + gasKg + transpKg) / 1000;

  document.getElementById("calcElet").textContent = (eletKg / 1000).toFixed(2) + " t";
  document.getElementById("calcGas").textContent = (gasKg / 1000).toFixed(2) + " t";
  document.getElementById("calcTransp").textContent = (transpKg / 1000).toFixed(2) + " t";
  document.getElementById("calcTotal").innerHTML =
    totalT.toFixed(2) + ' <span>tCO₂/mês</span>';

  const tanks = Math.round((totalT * 12) / 0.65);
  document.getElementById("calcCompare").textContent =
    "Isso equivale a cerca de " + tanks + " tanques de gás de cozinha por ano.";
}

["c-kwh","c-gas","c-km"].forEach(id => {
  document.getElementById(id).addEventListener("input", runCalc);
});

document.querySelectorAll("#fuelGroup .radio-opt").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll("#fuelGroup .radio-opt")
      .forEach(item => item.classList.remove("checked"));

    option.classList.add("checked");
    const radio = option.querySelector("input");
    radio.checked = true;
    runCalc();
  });
});

document.getElementById("calcBtn").addEventListener("click", runCalc);
runCalc();

