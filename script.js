(() => {
  const WHATSAPP_PHONE_E164 = "+0000000000"; // TODO: замените на ваш номер

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const whatsappNumberEl = document.getElementById("whatsappNumber");
  if (whatsappNumberEl) whatsappNumberEl.textContent = WHATSAPP_PHONE_E164;

  const burger = document.querySelector(".burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMobile = () => {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  };

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", expanded ? "false" : "true");
      mobileMenu.hidden = expanded;
    });

    mobileMenu.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.matches("a")) closeMobile();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobile();
    });
  }

  const buildWhatsAppUrl = (text) => {
    const base = "https://wa.me/";
    const phone = WHATSAPP_PHONE_E164.replace(/[^\d]/g, "");
    const encoded = encodeURIComponent(text);
    return `${base}${phone}?text=${encoded}`;
  };

  const cta = document.getElementById("whatsappCta");
  const headerWa = document.getElementById("whatsappHeader");
  const defaultText = "Здравствуйте! Хочу записаться на массаж. Подскажите, пожалуйста, ближайшее время.";
  const defaultUrl = buildWhatsAppUrl(defaultText);

  if (cta) cta.setAttribute("href", defaultUrl);
  if (headerWa) headerWa.setAttribute("href", defaultUrl);

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const sendToWhatsAppBtn = document.getElementById("sendToWhatsApp");

  const setStatus = (msg) => {
    if (!status) return;
    status.textContent = msg;
  };

  const getFormData = () => {
    if (!form) return null;
    const fd = new FormData(form);
    return {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };
  };

  const validate = (data) => {
    if (!data) return { ok: false, error: "Форма не найдена." };
    if (!data.name) return { ok: false, error: "Введите имя." };
    if (!data.phone) return { ok: false, error: "Введите телефон." };
    if (!data.message) return { ok: false, error: "Опишите запрос." };
    return { ok: true };
  };

  const makeTextFromData = (data) => {
    return [
      "Здравствуйте! Хочу записаться на массаж.",
      `Имя: ${data.name}`,
      `Телефон: ${data.phone}`,
      `Запрос: ${data.message}`,
    ].join("\n");
  };

  const sendViaWhatsApp = () => {
    const data = getFormData();
    const v = validate(data);
    if (!v.ok) {
      setStatus(v.error);
      return;
    }
    setStatus("Открываю WhatsApp…");
    const url = buildWhatsAppUrl(makeTextFromData(data));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (sendToWhatsAppBtn) {
    sendToWhatsAppBtn.addEventListener("click", sendViaWhatsApp);
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Без сервера/EmailJS логичнее отправлять в WhatsApp.
      sendViaWhatsApp();
    });
  }

  // Небольшая подсказка, чтобы при клике на детали не открывались все сразу.
  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    accordion.addEventListener("toggle", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLDetailsElement)) return;
      if (!target.open) return;
      accordion.querySelectorAll("details").forEach((d) => {
        if (d !== target) d.removeAttribute("open");
      });
    }, true);
  }
})();
