import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let carritoMozo = [];

export async function renderMozo(content) {
  content.innerHTML = `
    <h2>Pedido Manual</h2>
    <input id="mesaMozo" type="number" placeholder="Mesa">
    <div id="productosMozo"></div>
    <div id="carritoMozo"></div>
  `;

  cargarProductosMozo();
}

async function cargarProductosMozo() {
  const snap = await getDocs(collection(db, "productos"));
  const div = document.getElementById("productosMozo");

  div.innerHTML = "<h3>Productos</h3>";

  snap.forEach(docSnap => {
    const p = docSnap.data();
    div.innerHTML += `
      <div>
        ${p.nombre} - $${p.precio}
        <button onclick="agregarMozo('${p.nombre}', ${p.precio})">Agregar</button>
      </div>
    `;
  });
}

window.agregarMozo = function(nombre, precio) {
  carritoMozo.push({ nombre, precio });
  renderCarritoMozo();
};

function renderCarritoMozo() {
  const div = document.getElementById("carritoMozo");

  const total = carritoMozo.reduce((a, b) => a + b.precio, 0);

  div.innerHTML = `
    <h3>Carrito</h3>
    ${carritoMozo.map(p => `<div>${p.nombre} - $${p.precio}</div>`).join("")}
    <h4>Total: $${total}</h4>
    <button onclick="enviarPedidoMozo()">Enviar a Cocina</button>
  `;
}

window.enviarPedidoMozo = async function() {
  const mesa = document.getElementById("mesaMozo").value;
  if (!mesa) return alert("Ingresá mesa");
  if (carritoMozo.length === 0) return alert("Carrito vacío");

  await addDoc(collection(db, "pedidos"), {
    mesa,
    items: carritoMozo,
    estado: "pendiente",
    createdAt: serverTimestamp()
  });

  carritoMozo = [];
  document.getElementById("carritoMozo").innerHTML = "";
  alert("Pedido enviado");
};