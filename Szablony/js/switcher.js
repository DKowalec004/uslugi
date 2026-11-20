(function () {
  const STORAGE_KEY = "kowalec-szablony-palette";

  function currentTemplateId() {
    return document.documentElement.dataset.template || "";
  }

  function recommendedId() {
    const t = currentTemplateId();
    return (window.RECOMMENDED && window.RECOMMENDED[t]) || window.PALETTES[0].id;
  }

  function params() {
    return new URLSearchParams(location.search);
  }

  function findPalette(id) {
    return window.PALETTES.find((p) => p.id === id) || window.PALETTES[0];
  }

  function setUrl(palette) {
    const url = new URL(location.href);
    if (palette) url.searchParams.set("palette", palette);
    url.searchParams.delete("demo");
    history.replaceState({}, "", url);
  }

  function applyPalette(id, { pushUrl } = { pushUrl: true }) {
    const palette = findPalette(id);
    const root = document.documentElement;
    Object.entries(palette.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    if (!palette.vars["--tile-1"]) {
      const s = palette.swatches;
      root.style.setProperty("--tile-1", s[0]);
      root.style.setProperty("--tile-2", s[1]);
      root.style.setProperty("--tile-3", s[2]);
      root.style.setProperty("--tile-4", s[3]);
      root.style.setProperty("--tile-5", s[4]);
      root.style.setProperty("--tile-6", s[1]);
    }
    root.dataset.palette = palette.id;
    localStorage.setItem(STORAGE_KEY, palette.id);
    if (pushUrl) setUrl(palette.id);
    document.querySelectorAll("[data-palette-option]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.paletteOption === palette.id));
    });
    const label = document.querySelector("[data-palette-label]");
    if (label) {
      const rec = recommendedId() === palette.id ? " · rekomendowana" : "";
      label.textContent = palette.name + rec;
    }
    document.dispatchEvent(new CustomEvent("palettechange", { detail: palette }));
  }

  function prefix() {
    return currentTemplateId() ? "../" : "";
  }

  function jumpUrl(path) {
    const target = new URL(path, location.href);
    const palette = params().get("palette") || localStorage.getItem(STORAGE_KEY) || recommendedId();
    target.searchParams.set("palette", palette);
    target.searchParams.delete("demo");
    return target.href;
  }

  function buildBar() {
    const templateId = currentTemplateId();
    const bar = document.createElement("div");
    bar.className = "combo-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Nawigacja szablonów i kompozycji kolorów");

    const homeHref = templateId ? prefix() + "index.html" : "#layouty";
    const selectOptions = window.TEMPLATES.map((t) => {
      const selected = t.id === templateId ? " selected" : "";
      const path = templateId ? t.id + ".html" : "templates/" + t.id + ".html";
      return `<option value="${path}"${selected}>${t.name}</option>`;
    }).join("");

    const palettes = window.PALETTES.map((p) => {
      const stripes = p.swatches.map((c) => `<span style="background:${c}"></span>`).join("");
      const rec = p.id === recommendedId() ? " combo-swatch--rec" : "";
      return `<button type="button" class="combo-swatch${rec}" data-palette-option="${p.id}" aria-pressed="false" title="${p.name} — ${p.source}">
        <span class="combo-swatch__stripes">${stripes}</span>
        <span class="combo-swatch__name">${p.name}</span>
      </button>`;
    }).join("");

    const theme = templateId ? `<p class="combo-bar__theme" data-demo-theme></p>` : "";

    bar.innerHTML = `
      <div class="combo-bar__row">
        <a class="combo-bar__home" href="${homeHref}">← Szablony</a>
        <label class="combo-bar__jump">
          <span>Layout</span>
          <select data-template-jump>${selectOptions}</select>
        </label>
        ${theme}
        <p class="combo-bar__current"><strong data-palette-label></strong></p>
      </div>
      <div class="combo-bar__palettes">${palettes}</div>
    `;
    document.body.appendChild(bar);

    bar.querySelectorAll("[data-palette-option]").forEach((btn) => {
      btn.addEventListener("click", () => applyPalette(btn.dataset.paletteOption));
    });
    bar.querySelector("[data-template-jump]").addEventListener("change", (e) => {
      location.href = jumpUrl(e.target.value);
    });
  }

  function init() {
    const fromUrl = params().get("palette");
    const fromStore = localStorage.getItem(STORAGE_KEY);
    const initial = fromUrl || fromStore || recommendedId();
    applyPalette(initial, { pushUrl: true });
    buildBar();
    applyPalette(initial, { pushUrl: false });
    if (typeof window.applyExampleMode === "function") window.applyExampleMode();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
