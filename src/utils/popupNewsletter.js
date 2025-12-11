export function popupNewsletter() {
  const pupupMessage = document.querySelector(
    ".subscribe-form .popup-message",
  );

  if (!pupupMessage) return false;
  pupupMessage.classList.add("show");

  setTimeout(() => {
    pupupMessage.classList.remove("show");
  }, 3000);
}