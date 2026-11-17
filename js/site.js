(function () {
  const overlay = document.getElementById("overlay");
  const panels = overlay.querySelectorAll("[data-panel]");
  const triggers = document.querySelectorAll("[data-open]");
  const closeBtn = overlay.querySelector(".close");
  const form = document.getElementById("brief");
  const status = document.getElementById("form-status");

  function openPanel(id) {
    panels.forEach((p) => {
      p.hidden = p.dataset.panel !== id;
    });
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    triggers.forEach((b) => b.classList.toggle("is-on", b.dataset.open === id));
    closeBtn.focus();
  }

  function closePanel() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    triggers.forEach((b) => b.classList.remove("is-on"));
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => openPanel(btn.dataset.open));
  });
  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePanel();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closePanel();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "Dziękuję. Odezwię się w ciągu jednego dnia roboczego — na razie to podgląd formularza, bez wysyłki.";
    form.reset();
  });
})();
