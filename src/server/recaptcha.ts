import { SECRET_RECAPTCHA_API_KEY as SECRET_KEY } from "astro:env/server";

/**
  * Crea una evaluación para analizar el riesgo de una acción de la IU.
  *
  * projectID: El ID del proyecto de Google Cloud.
  * recaptchaSiteKey: La clave reCAPTCHA asociada con el sitio o la aplicación
  * token: El token generado obtenido del cliente.
  * recaptchaAction: El nombre de la acción que corresponde al token.
  */
export async function createAssessment({ token }: { token: string; }): Promise<number | null> {
  if (!SECRET_KEY) throw new Error("Secret RECAPTCHA key is not defined");

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${SECRET_KEY}&response=${token}`,
  });

  if (!response.ok) throw new Error("Failed to verify reCAPTCHA token");

  const data = await response.json();

  // data.success === true if the captcha is valid
  return data.success ? data.score ?? 1 : null;
}