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

  const openIntakeBtn = document.getElementById("openIntake");
  const intakeModal = document.getElementById("intakeModal");
  const intakeForm = document.getElementById("intakeForm");
  const intakeStatus = document.getElementById("intakeStatus");
  const INTAKE_STORAGE_KEY = "massage:intake";
  let lastFocusedEl = null;

  const setIntakeStatus = (msg) => {
    if (!intakeStatus) return;
    intakeStatus.textContent = msg;
  };

  const openModal = () => {
    if (!intakeModal) return;
    lastFocusedEl = document.activeElement;
    intakeModal.hidden = false;
    document.body.style.overflow = "hidden";
    const first = intakeModal.querySelector("input, select, textarea, button");
    if (first && typeof first.focus === "function") first.focus();
  };

  const closeModal = () => {
    if (!intakeModal) return;
    intakeModal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
  };

  const loadIntake = () => {
    if (!intakeForm) return;
    const raw = localStorage.getItem(INTAKE_STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([name, value]) => {
        const els = intakeForm.querySelectorAll(`[name="${CSS.escape(name)}"]`);
        if (!els.length) return;
        els.forEach((el) => {
          if (el instanceof HTMLInputElement) {
            if (el.type === "radio") el.checked = String(el.value) === String(value);
            else if (el.type === "checkbox") {
              const arr = Array.isArray(value) ? value.map(String) : [String(value)];
              el.checked = arr.includes(String(el.value));
            } else {
              el.value = String(value ?? "");
            }
          } else if (el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
            el.value = String(value ?? "");
          }
        });
      });
      setIntakeStatus("Ответы загружены (вы можете изменить и сохранить снова). ");
    } catch {
      // ignore
    }
  };

  const serializeIntake = () => {
    if (!intakeForm) return null;
    const fd = new FormData(intakeForm);
    const out = {};
    for (const [k, v] of fd.entries()) {
      if (out[k] === undefined) out[k] = v;
      else if (Array.isArray(out[k])) out[k].push(v);
      else out[k] = [out[k], v];
    }
    return out;
  };

  if (openIntakeBtn) {
    openIntakeBtn.addEventListener("click", () => {
      loadIntake();
      openModal();
    });
  }

  if (intakeModal) {
    intakeModal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t instanceof Element && t.hasAttribute("data-close-modal")) {
        closeModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (intakeModal.hidden) return;
      if (e.key === "Escape") closeModal();
    });
  }

  if (intakeForm) {
    intakeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const wellbeing = intakeForm.querySelector("[name=wellbeing]");
      const acute = intakeForm.querySelector("input[name=acute]:checked");
      const pregnancy = intakeForm.querySelector("input[name=pregnancy]:checked");
      const veins = intakeForm.querySelector("input[name=veins]:checked");
      const skin = intakeForm.querySelector("input[name=skin]:checked");

      if (!(wellbeing instanceof HTMLSelectElement) || !wellbeing.value) {
        setIntakeStatus("Выберите самочувствие (вопрос 1). ");
        wellbeing?.focus?.();
        return;
      }
      if (!acute || !pregnancy || !veins || !skin) {
        setIntakeStatus("Пожалуйста, ответьте на вопросы с выбором (4, 5, 7, 8). ");
        return;
      }

      const data = serializeIntake();
      if (!data) return;
      localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data));
      setIntakeStatus("Сохранено. Спасибо! ");
      setTimeout(() => closeModal(), 450);
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
