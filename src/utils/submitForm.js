export function submitForm(id, Key, callback) {
  if (!id) return false;
  const handlerClasses = (els, classe, action) => {
    if (!els || !classe) return false;

    els.forEach((el) => {
      el.classList[ action ](classe);
    });
  };
  const form = document.getElementById(id);
  const messageContainer = document?.querySelector(`#${id}Container #message`);
  const message = document?.querySelector(`#${id}Container #message .message`);
  const loading = document?.querySelector(`#${id}Container .loading`);
  const loader = document?.querySelector(`#${id}Container .loader`);
  if (!form || !message || !messageContainer || !loading || !loader) return false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    message.textContent = "Enviando...";
    handlerClasses([ messageContainer, loading, loader ], "show", "add");

    const formData = new FormData(form);

    try {
      // Create token reCAPTCHA
      const token = await grecaptcha.execute(Key, { action: 'LOGIN' });

      formData.append("recaptchaToken", token); // append token to form data

    } catch (err) {
      console.error("Error generating reCAPTCHA token:", err);
    }

    try {

      const res = await fetch("/api/form/v1/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        message.textContent = "Error: " + (data?.message || "No se pudo enviar.");
        messageContainer.classList.add("show");
        handlerClasses([ loader, loading ], "show", "remove");
        return;
      }

      message.textContent = data.message || "Enviado correctamente.";
      messageContainer.classList.add("show");
      form.style.display = "none";

      if (typeof callback === "function") {
        callback();
      }

      handlerClasses([ loader, loading ], "show", "remove");

      form.reset();

    } catch (error) {
      message.textContent = "Error de servidor, intenta de nuevo.";
      messageContainer.classList.add("show");
      handlerClasses([ loader, loading ], "show", "remove");
    }
  });
}