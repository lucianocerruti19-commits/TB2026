import { renderMozo } from "./modules/mozo.js";
import { renderDueno } from "./modules/dueno.js";
import { renderCliente } from "./modules/cliente.js";
import { renderCocina } from "./modules/cocina.js";
import { renderAdmin } from "./modules/admin.js";
import { validarAcceso } from "./modules/auth.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.addEventListener("click", () => {
  const panel = document.getElementById("panelSelect").value;
  const password = document.getElementById("passwordInput").value;

  if(!validarAcceso(panel, password)) {
    alert("Contraseña incorrecta");
    return;
  }

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
function cargarPanel(panel) {
  const content = document.getElementById("content");

  if(panel === "admin") {
  renderAdmin(content);

  import("./modules/dueno.js").then(module => {
    module.renderDueno(content);
  });

  return;
}
  

  if(panel === "cliente") {
    renderCliente(content);
    return;
  }

  if(panel === "cocina") {
    renderCocina(content);
    return;
  }

  if(panel === "mozo") {
    renderMozo(content);
    return;
  }

  if(panel === "dueno") {
    renderDueno(content);
    return;
  }
}