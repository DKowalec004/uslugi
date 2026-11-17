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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("[type=submit]");
    const label = btn.textContent;
    status.textContent = "";
    status.classList.remove("status--ok", "status--err");
    form.setAttribute("aria-busy", "true");
    btn.disabled = true;
    btn.textContent = "Wysyłanie…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        status.textContent = "Dziękuję. Odezwę się w ciągu kilku dni.";
        status.classList.add("status--ok");
      } else {
        const fromApi = Array.isArray(data.errors)
          ? data.errors.map((err) => err.message).filter(Boolean).join(" ")
          : "";
        status.textContent = fromApi || "Nie udało się wysłać. Spróbuj jeszcze raz albo napisz na kontakt@kowalecweb.pl.";
        status.classList.add("status--err");
      }
    } catch {
      status.textContent = "Brak połączenia. Sprawdź sieć albo napisz na kontakt@kowalecweb.pl.";
      status.classList.add("status--err");
    } finally {
      form.removeAttribute("aria-busy");
      btn.disabled = false;
      btn.textContent = label;
    }
  });
})();
