const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const list = tab.closest("[role='tablist']");
    const target = document.getElementById(tab.getAttribute("aria-controls"));
    if (!list || !target) return;
    list.querySelectorAll(".tab").forEach((item) => {
      item.setAttribute("aria-selected", "false");
      item.tabIndex = -1;
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.hidden = true;
    });
    tab.setAttribute("aria-selected", "true");
    tab.tabIndex = 0;
    target.hidden = false;
  });
});

const ledButton = document.querySelector("[data-led-toggle]");
const led = document.querySelector("[data-led]");
const ledState = document.querySelector("[data-led-state]");

if (ledButton && led && ledState) {
  ledButton.addEventListener("click", () => {
    const on = led.classList.toggle("on");
    ledState.textContent = on ? "HIGH · LED on" : "LOW · LED off";
    ledButton.textContent = on ? "Write LOW" : "Write HIGH";
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});
