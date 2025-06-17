
// indexedDB.js
function guardarEnIndexedDB(data) {
  const req = indexedDB.open("Modulo4DB", 1);
  req.onupgradeneeded = e => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("registros")) {
      db.createObjectStore("registros", { keyPath: "fecha" });
    }
  };
  req.onsuccess = e => {
    const db = e.target.result;
    const tx = db.transaction("registros", "readwrite");
    const store = tx.objectStore("registros");
    store.put(data);
  };
}

// export.js
function exportarJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modulo4_registros.json';
  a.click();
  URL.revokeObjectURL(url);
}

// main.js funcional
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
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Error registrando Service Worker:', err));
  });
}
