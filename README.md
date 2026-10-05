# Massage studio landing page

A light, responsive Russian-language landing page for a massage therapist, written in plain HTML, CSS and JavaScript with no framework and no build step. It covers services, massage types, short articles and contacts. Booking happens over WhatsApp: the buttons and the contact form open a chat with a pre-filled message. A "before your first visit" questionnaire opens in an accessible modal (focus moves into the dialog and returns afterwards) and saves the answers in the browser's `localStorage`. The mobile menu supports the Escape key and `aria-expanded`. The WhatsApp number is a placeholder constant at the top of `script.js`, waiting for the real one.

<p align="center">
  <img src="docs/screenshots/home.webp" alt="Hero section: headline, booking buttons, three short facts and an illustration of a massage session" width="80%">
</p>
<p align="center">
  <img src="docs/screenshots/services.webp" alt="Services section with service cards" width="80%">
</p>

**Stack:** HTML5 · CSS3 · vanilla JavaScript.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5173     # http://localhost:5173
```

## Author

Evgeny Nemchenko, full-stack developer: [bluecat.cc](https://bluecat.cc) · [LinkedIn](https://www.linkedin.com/in/evgeny-nemchenko) · [nevgeny90@gmail.com](mailto:nevgeny90@gmail.com) · [GitHub @Jony251](https://github.com/Jony251)
