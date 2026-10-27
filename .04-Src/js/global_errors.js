// v21 E7: глобальный обработчик ошибок (в начало main_events.js подключается через index.html после main.js)
window.addEventListener('error', function(e){
  try { if (window.showToast) window.showToast('Ошибка: ' + (e.message || 'unknown'), '#f88'); } catch(e2){}
});
window.addEventListener('unhandledrejection', function(e){
  try { if (window.showToast) window.showToast('Ошибка (async)', '#f88'); } catch(e2){}
});
