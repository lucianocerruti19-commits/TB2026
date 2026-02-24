import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let carrito = [];

export async function renderCliente(content) {
  content.innerHTML = `
    <h2>Ingresar Mesa</h2>
    <input id="mesaInput" type="number" placeholder="Número de mesa">
    <button id="verMenuBtn">Ver Menú</button>
    <div id="menuContainer"></div>
    <div id="carritoContainer"></div>
  `;

  document.getElementById("verMenuBtn")
    .addEventListener("click", cargarMenu);
}

async function cargarMenu() {
  const mesa = document.getElementById("mesaInput").value;
  if (!mesa) return alert("Ingresá número de mesa");

  const menuDiv = document.getElementById("menuContainer");
  const snap = await getDocs(collection(db, "productos"));

  menuDiv.innerHTML = "<h3>Menú</h3>";

  snap.forEach(docSnap => {
    const p = docSnap.data();

    menuDiv.innerHTML += `
      <div>
        ${p.nombre} - $${p.precio}
        <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio})">Agregar</button>
      </div>
    `;
  });
}

window.agregarAlCarrito = function(nombre, precio) {
  carrito.push({ nombre, precio });
  renderCarrito();
};

function renderCarrito() {
  const div = document.getElementById("carritoContainer");

  let total = carrito.reduce((acc, p) => acc + p.precio, 0);

  div.innerHTML = `
    <h3>Carrito</h3>
    ${carrito.map(p => `<div>${p.nombre} - $${p.precio}</div>`).join("")}
    <h4>Total: $${total}</h4>
    <button onclick="enviarPedido()">Enviar Pedido</button>
  `;
}

window.enviarPedido = async function() {
  const mesa = document.getElementById("mesaInput").value;

  if (carrito.length === 0) return alert("Carrito vacío");

  await addDoc(collection(db, "pedidos"), {
    mesa,
    items: carrito,
    estado: "pendiente",
    createdAt: serverTimestamp()
  });

  carrito = [];
  document.getElementById("carritoContainer").innerHTML = "";
  alert("Pedido enviado a cocina");
};