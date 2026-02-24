import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export async function renderDueno(content) {
  content.innerHTML = `
    <h2>Panel Dueño</h2>
    <div id="stats"></div>
  `;

  calcularStats();
}

async function calcularStats() {
  const snap = await getDocs(collection(db, "pedidos"));

  let hoy = 0;
  let semana = 0;
  let mes = 0;

  const ahora = new Date();

  snap.forEach(docSnap => {
    const p = docSnap.data();
    if (!p.createdAt) return;

    const fecha = p.createdAt.toDate();
    const total = p.items.reduce((a, b) => a + b.precio, 0);

    const diffDias = (ahora - fecha) / (1000 * 60 * 60 * 24);

    if (diffDias <= 1) hoy += total;
    if (diffDias <= 7) semana += total;
    if (diffDias <= 30) mes += total;
  });

  document.getElementById("stats").innerHTML = `
  <div class="dashboard-grid">
    <div class="stat-box">
      <h3>Ventas Hoy</h3>
      <p>$${hoy}</p>
    </div>
    <div class="stat-box">
      <h3>Últimos 7 días</h3>
      <p>$${semana}</p>
    </div>
    <div class="stat-box">
      <h3>Últimos 30 días</h3>
      <p>$${mes}</p>
    </div>
  </div>
`;