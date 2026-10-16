// Fills the owner's name and contact email on the privacy and terms pages from config.js.
(() => {
  const cfg = window.HKR_CONFIG || {};
  document.querySelectorAll("[data-cfg]").forEach(el => {
    const v = cfg[el.dataset.cfg];
    if (v && !/YOUR/.test(v)) el.textContent = v;
  });
})();
