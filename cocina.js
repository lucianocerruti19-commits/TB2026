let pedidosPrevios = [];
import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export function renderCocina(content) {
  content.innerHTML = `
    <h2>Pedidos en Cocina</h2>
    <div id="listaPedidos"></div>
  `;

  onSnapshot(collection(db, "pedidos"), snap => {
  const lista = document.getElementById("listaPedidos");
  lista.innerHTML = "";

  snap.forEach(docSnap => {
    const p = docSnap.data();
    const esNuevo = !pedidosPrevios.includes(docSnap.id);

    lista.innerHTML += `
      <div class="card status-${p.estado} ${esNuevo ? 'new-order' : ''}">
        <strong>Mesa ${p.mesa}</strong>
        <div style="margin:10px 0;">
          ${p.items.map(i => i.nombre).join(", ")}
        </div>
        <div><b>Estado:</b> ${p.estado}</div>
        <div style="margin-top:10px;">
          <button onclick="cambiarEstado('${docSnap.id}', 'preparando')">Preparando</button>
          <button onclick="cambiarEstado('${docSnap.id}', 'listo')">Listo</button>
          <button onclick="cambiarEstado('${docSnap.id}', 'entregado')">Entregado</button>
        </div>
      </div>
    `;

    if (esNuevo) {
      document.getElementById("notifSound").play();
    }
  });

  pedidosPrevios = snap.docs.map(d => d.id);
});
  </div>
`;
        <
        </div>
      `;
    });
  });
}

window.cambiarEstado = async function(id, nuevoEstado) {
  await updateDoc(doc(db, "pedidos", id), {
    estado: nuevoEstado
  });
};