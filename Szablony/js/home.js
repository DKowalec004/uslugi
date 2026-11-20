(function () {
  function renderCards() {
    const root = document.getElementById("layout-grid");
    if (!root) return;
    root.innerHTML = window.TEMPLATES.map((t) => {
      const pal = window.PALETTES.find((p) => p.recommendedFor === t.id);
      const stripes = pal.swatches.map((c) => `<span style="background:${c}"></span>`).join("");
      return `<a class="layout-card" href="${t.href}">
        <p class="kicker">${t.kicker}</p>
        <h2>${t.name}</h2>
        <p class="typ">${t.typ}</p>
        <p class="best"><strong>Najlepsze do:</strong> ${t.best}</p>
        <p class="kicker">Rekomendowana paleta · ${pal.name}</p>
        <div class="swatch-row">${stripes}</div>
        <span class="cta">Otwórz szablon →</span>
      </a>`;
    }).join("");
  }

  renderCards();
})();
