const form = document.getElementById('note-form');
const input = document.getElementById('note-input');
const list = document.getElementById('notes-list');

// ===== Работа с заметками =====
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  list.innerHTML = notes.map(note => `<li>${note}</li>`).join('');
}

function addNote(text) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.push(text);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();

  if (text) {
    addNote(text);
    input.value = '';
  }
});

loadNotes();

// ===== Регистрация Service Worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker зарегистрирован:', reg.scope);
    } catch (e) {
      console.error('Ошибка SW:', e);
    }
  });
}

// ===== УСТАНОВКА PWA =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = "📲 Установить приложение";
  installBtn.style.marginTop = "20px";

  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', async () => {
    installBtn.remove();

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log('Результат установки:', outcome);
    deferredPrompt = null;
  });
});