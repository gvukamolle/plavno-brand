const toast = document.querySelector('.toast');
let toastTimer;

function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
}

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const color = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(color);
      notify(`${color.toUpperCase()} скопирован`);
    } catch {
      notify(`Цвет: ${color.toUpperCase()}`);
    }
  });
});
