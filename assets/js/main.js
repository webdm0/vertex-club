const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function closeMenu() {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  mobileNav.hidden = true;
}

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  mobileNav.hidden = !willOpen;
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 861px)").matches) closeMenu();
});

const bookingForm = document.querySelector("#booking-form");
const formStatus = bookingForm?.querySelector(".booking-form__status");
const submitButton = bookingForm?.querySelector(".booking-form__submit");

bookingForm?.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("invalid", () => {
    field.setAttribute("aria-invalid", "true");
  });

  field.addEventListener("input", () => {
    if (field.checkValidity()) field.removeAttribute("aria-invalid");
  });

  field.addEventListener("change", () => {
    if (field.checkValidity()) field.removeAttribute("aria-invalid");
  });
});

bookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const endpoint = bookingForm.dataset.endpoint?.trim();
  if (!endpoint) {
    if (!formStatus) return;
    formStatus.textContent =
      "La réservation en ligne n’est pas encore connectée. Ajoutez l’adresse du service de réservation avant la mise en ligne.";
    formStatus.dataset.state = "error";
    return;
  }

  if (!formStatus || !submitButton) return;

  submitButton.disabled = true;
  bookingForm.setAttribute("aria-busy", "true");
  formStatus.textContent = "Envoi en cours…";
  formStatus.dataset.state = "loading";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(bookingForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Request failed");

    bookingForm.reset();
    formStatus.textContent = "Merci. Votre demande a bien été envoyée.";
    formStatus.dataset.state = "success";
  } catch {
    formStatus.textContent =
      "L’envoi a échoué. Réessayez dans quelques instants.";
    formStatus.dataset.state = "error";
  } finally {
    submitButton.disabled = false;
    bookingForm.removeAttribute("aria-busy");
  }
});
