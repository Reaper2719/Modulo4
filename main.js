
import { guardarEnIndexedDB } from './indexedDB.js';
import { exportarJSON } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-zonas');
  const lista = document.getElementById('lista-observaciones');
  const exportarBtn = document.getElementById('exportar');
  const registros = [];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.fecha = new Date().toISOString();
    registros.push(data);
    guardarEnIndexedDB(data);
    mostrar(data);
    form.reset();
  });

  exportarBtn.addEventListener('click', () => {
    exportarJSON(registros);
  });

  function mostrar(data) {
    const div = document.createElement('div');
    div.textContent = "Observación guardada: " + data.fecha;
    lista.appendChild(div);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js') // ruta corregida
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Error registrando Service Worker:', err));
  });
}
