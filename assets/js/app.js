const DEFAULT_TYPING = {
  es: [
    'console.log("Hola Mundo");',
    "arquitecturas modernas y escalables",
    'import { impacto } from "producto";',
    "render(<Experiencia />);",
    "// calidad, rendimiento y mantenibilidad",
    'git commit -m "feat: entregar valor"',
  ],
  en: [
    'console.log("Hello World");',
    "building modern and scalable systems",
    'import { impact } from "product";',
    "render(<Experience />);",
    "// quality, performance and maintainability",
    'git commit -m "feat: ship value"',
  ],
};

const state = {
  lang:
    localStorage.getItem("cv-lang") ||
    (navigator.language.startsWith("es") ? "es" : "en"),
  data: null,
};

async function loadData(lang) {
  const res = await fetch(`data/cv.${lang}.json`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`No se pudo cargar data/cv.${lang}.json`);
  }
  return res.json();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderStatic(data) {
  document.title = `${data.profile.name} — ${data.profile.role}`;
  document.getElementById("navLogo").innerHTML = `<svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`;

  data.nav.items.forEach((item) => {
    const el = document.querySelector(`[data-nav="${item.id}"]`);
    if (el) el.textContent = item.label;
  });

  document.getElementById("heroAvatar").src = data.profile.photo;
  document.getElementById("heroAvatar").alt = data.profile.name;
  document.getElementById("heroName").textContent = data.profile.name;
  document.getElementById("heroSubtitle").textContent = data.profile.role;
  document.getElementById("heroSummary").textContent = data.hero.summary;
  document.getElementById("heroGreeting").textContent =
    state.lang === "es" ? "Hola, soy" : "Hi, I am";
  
  const emailIcon = `<svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
  const codeIcon = `<svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
  
  document.getElementById("heroBtnContact").innerHTML = `${emailIcon} ${data.ui.contactMe}`;
  document.getElementById("heroBtnProjects").innerHTML = `${codeIcon} ${data.ui.viewSkills}`;

  document.getElementById("aboutLabel").textContent = data.about.label;
  document.getElementById("aboutTitle").textContent = data.about.title;
  document.getElementById("aboutText").innerHTML = data.about.paragraphs
     .map((p) => `<p>${escapeHtml(p)}</p>`)
     .join("");
  document.getElementById("aboutStats").innerHTML = data.about.stats
     .map(
       (s) => `
     <div class="stat-card" style="elevation: 2">
       <div class="stat-number" data-count="${s.value}">0</div>
       <div class="stat-label">${escapeHtml(s.label)}</div>
     </div>
   `,
     )
     .join("");
 
   document.getElementById("expLabel").textContent = data.experience.label;
   document.getElementById("expTitle").textContent = data.experience.title;
   document.getElementById("expDesc").textContent =
     data.experience.subtitle;
   document.getElementById("experienceTimeline").innerHTML =
     data.experience.items
       .map(
         (job) => `
     <div class="timeline-item reveal">
       <div class="timeline-dot"></div>
       <div class="timeline-card" style="elevation: 2">
         <span class="timeline-date">${escapeHtml(job.period)}</span>
         <h3 class="timeline-role">${escapeHtml(job.role)}</h3>
         <p class="timeline-company">${escapeHtml(job.company)} &middot; ${escapeHtml(job.location)}</p>
         <ul class="timeline-desc">
           ${job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
         </ul>
         <div class="timeline-tags">
           ${job.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
         </div>
       </div>
     </div>
   `,
       )
       .join("");
 
   document.getElementById("skillsLabel").textContent = data.skills.label;
   document.getElementById("skillsTitle").textContent = data.skills.title;
   document.getElementById("skillsDesc").textContent = data.skills.desc;

  const skillIcons = [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="skill-svg"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="skill-svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="skill-svg"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="skill-svg"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path></svg>`
  ];
  const skillColors = [
    "rgba(99, 102, 241, 0.12)",
    "rgba(168, 85, 247, 0.12)",
    "rgba(20, 184, 166, 0.12)",
    "rgba(249, 115, 22, 0.12)",
  ];

  document.getElementById("skillsGrid").innerHTML = data.skills.categories
    .map(
      (cat, idx) => `
    <div class="skill-category" style="elevation: 2">
      <div class="skill-category-header">
        <div class="skill-icon" style="background:${skillColors[idx % skillColors.length]};">${skillIcons[idx % skillIcons.length]}</div>
        <h3 class="skill-category-title">${escapeHtml(cat.title)}</h3>
      </div>
      <div class="skill-items-container">
        ${cat.items
          .map(
            (it) => `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name">${escapeHtml(it.name)}</span>
              <span class="skill-percent">${it.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" data-width="${it.level}%"></div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
    )
    .join("");

  const projectsGrid = document.getElementById("projectsGrid");
  if (projectsGrid) {
    document.getElementById("projectsLabel").textContent =
      data.projects.label;
    document.getElementById("projectsTitle").textContent =
      data.projects.title;
    document.getElementById("projectsDesc").textContent =
      data.projects.subtitle;

    const projectGradients = [
      "linear-gradient(135deg, #6c63ff, #3b82f6)",
      "linear-gradient(135deg, #e942f5, #f97316)",
      "linear-gradient(135deg, #06b6d4, #6c63ff)",
    ];

    projectsGrid.innerHTML = data.projects.items
      .map(
        (project, idx) => `
      <div class="project-card" style="elevation: 2">
        <div class="project-image" style="background:${projectGradients[idx % projectGradients.length]};">
          <span class="project-icon">${escapeHtml(project.icon || "🚀")}</span>
        </div>
        <div class="project-content">
          <p class="project-type">${escapeHtml(project.type)}</p>
          <h3 class="project-title">${escapeHtml(project.title)}</h3>
          <p class="project-desc">${escapeHtml(project.description)}</p>
          <div class="project-tech">
            ${project.tech.map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`).join("")}
          </div>
          <div class="project-links">
            <a href="${project.demo || "#"}" class="project-link" target="_blank" rel="noopener noreferrer">🔗 Demo →</a>
            <a href="${project.github || "#"}" class="project-link" target="_blank" rel="noopener noreferrer">📂 GitHub →</a>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  }

  document.getElementById("eduLabel").textContent = data.education.label;
  document.getElementById("eduTitle").textContent = data.education.title;
  document.getElementById("educationGrid").innerHTML =
    data.education.items
      .map(
        (edu) => `
    <div class="edu-card" style="elevation: 2">
      <span class="edu-year">${escapeHtml(edu.period)}</span>
      <h3 class="edu-degree">${escapeHtml(edu.degree)}</h3>
      <p class="edu-school">${escapeHtml(edu.school)}</p>
    </div>
  `,
      )
      .join("");

  document.getElementById("contactLabel").textContent =
    data.contact.label;
  document.getElementById("contactTitle").textContent =
    data.contact.title;
  document.getElementById("contactText").textContent =
    data.contact.subtitle;

  const contactIcons = {
    Email: `<svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    Telefono: `<svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></svg>`,
    Teléfono: `<svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></svg>`,
    Phone: `<svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></svg>`,
    LinkedIn: `<svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    GitHub: `<svg class="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
  };

  document.getElementById("contactLinks").innerHTML = data.contact.items
    .filter(
      (item) =>
        !["Ubicacion", "Ubicación", "Location"].includes(item.label),
    )
    .map((item) => {
      const icon = contactIcons[item.label] || "🔗";
      const href = item.href || "#";
      const tag = item.href ? "a" : "div";
      const attrs = item.href
        ? `href="${href}" ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ""}`
        : "";
      return `
      <${tag} ${attrs} class="contact-card" style="elevation: 2">
        <span class="icon">${icon}</span>
        <div class="info">
          <div class="label">${escapeHtml(item.label)}</div>
          <div class="value">${escapeHtml(item.value)}</div>
        </div>
      </${tag}>
    `;
    })
    .join("");

  const year = new Date().getFullYear();
  document.getElementById("footerText").innerHTML = data.footer.replace(
    "{year}",
    year,
  );
  document.documentElement.setAttribute("lang", state.lang);
  
  const langSelectEl = document.getElementById("langSelect");
  if (langSelectEl) {
    langSelectEl.querySelectorAll(".lang-switch-btn").forEach(btn => {
      const isCurrent = btn.getAttribute("data-lang") === state.lang;
      btn.classList.toggle("active", isCurrent);
      
      // Highly specific tooltips per button!
      if (btn.getAttribute("data-lang") === "es") {
        btn.setAttribute("data-tooltip", state.lang === "es" ? "Idioma: Español (Activo)" : "Switch to Spanish");
      } else {
        btn.setAttribute("data-tooltip", state.lang === "es" ? "Cambiar a Inglés" : "Language: English (Active)");
      }
    });
  }

  // Translate dynamic UI labels & attributes for premium accessibility (a11y)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", data.ui.themeToggle);
    themeToggle.setAttribute("data-tooltip", data.ui.themeToggle);
  }
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.setAttribute("aria-label", data.ui.langSelect);
    // Removed parent data-tooltip to avoid clashing with specific button tooltips!
  }
  const hamburger = document.getElementById("hamburger");
  if (hamburger) hamburger.setAttribute("aria-label", data.ui.hamburger);
  
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.setAttribute("aria-label", data.ui.backToTop);
    backToTop.setAttribute("data-tooltip", data.ui.backToTop);
  }
  
  const termTrigger = document.getElementById("terminalTrigger");
  if (termTrigger) {
    termTrigger.setAttribute("aria-label", data.ui.terminalTrigger);
    termTrigger.setAttribute("data-tooltip", data.ui.terminalTrigger);
  }
  
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.setAttribute("data-tooltip", data.ui.downloadCv);
  }
  
  const syncBtn = document.getElementById("terminalSyncBtn");
  if (syncBtn) {
    syncBtn.setAttribute("data-tooltip", state.lang === "es" ? "Sincronizar tema con el sistema" : "Sync theme with system");
  }
  
  const closeBtn = document.getElementById("terminalCloseBtn");
  if (closeBtn) {
    closeBtn.setAttribute("data-tooltip", state.lang === "es" ? "Cerrar / Minimizar (Esc)" : "Close / Minimize (Esc)");
  }

  const termInput = document.getElementById("terminalInput");
  if (termInput) termInput.setAttribute("aria-label", data.ui.terminalInput);

  const modalTitle = document.getElementById("modalTitle");
  if (modalTitle) modalTitle.textContent = data.ui.modalTitle;
  const modalCloseBtn = document.getElementById("modalClose");
  if (modalCloseBtn) modalCloseBtn.setAttribute("aria-label", data.ui.modalClose);

  // Subtitles inside download modal cards
  const descLightES = document.querySelector("#modalDownloadMDes p");
  if (descLightES) descLightES.textContent = state.lang === "es" ? "Formato de texto ligero" : "Lightweight text format";
  const descLightEN = document.querySelector("#modalDownloadMDen p");
  if (descLightEN) descLightEN.textContent = state.lang === "es" ? "Formato de texto ligero" : "Lightweight text format";
  const descPrintES = document.querySelector("#modalDownloadPDFes p");
  if (descPrintES) descPrintES.textContent = state.lang === "es" ? "Formato listo para impresión" : "Print-ready format";
  const descPrintEN = document.querySelector("#modalDownloadPDFen p");
  if (descPrintEN) descPrintEN.textContent = state.lang === "es" ? "Formato listo para impresión" : "Print-ready format";

  // ── CV Download Logic ──
  const downloadText = document.getElementById("downloadText");
  const modal = document.getElementById("downloadModal");
  const modalClose = document.getElementById("modalClose");
 
  const downloadIcon = `<svg class="btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
  
  if (downloadText) downloadText.innerHTML = `${downloadIcon} ${data.ui.downloadCv}`;
 
  async function downloadFile(fileUrl, fileName) {
    const res = await fetch(fileUrl);
    if (!res.ok) { alert("File not found: " + res.status); return; }
    const buf = await res.arrayBuffer();
 
    if (window.showSaveFilePicker) {
      try {
        const ext = fileName.split(".").pop();
        const mimeMap = { pdf: "application/pdf", md: "text/markdown" };
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: ext.toUpperCase() + " file",
            accept: { [mimeMap[ext] || "application/octet-stream"]: ["." + ext] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(buf);
        await writable.close();
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
 
    const file = new File([buf], fileName, { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { link.remove(); URL.revokeObjectURL(link.href); }, 5000);
  }
 
  // Trigger modal visibility
  if (downloadBtn) downloadBtn.onclick = () => modal.setAttribute("aria-hidden", "false");
  
  if (modalClose) modalClose.onclick = () => modal.setAttribute("aria-hidden", "true");
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.setAttribute("aria-hidden", "true");
    };
  }
 
  // Bind individual download selections inside modal
  const mDes = document.getElementById("modalDownloadMDes");
  const mDen = document.getElementById("modalDownloadMDen");
  const pDes = document.getElementById("modalDownloadPDFes");
  const pDen = document.getElementById("modalDownloadPDFen");
 
  if (mDes) mDes.onclick = () => { downloadFile("./export/cv.es.md", "Enmanuel_Leon_CV_ES.md"); modal.setAttribute("aria-hidden", "true"); };
  if (mDen) mDen.onclick = () => { downloadFile("./export/cv.en.md", "Enmanuel_Leon_CV_EN.md"); modal.setAttribute("aria-hidden", "true"); };
  if (pDes) pDes.onclick = () => { downloadFile("./export/Enmanuel_Leon_CV_ES.pdf", "Enmanuel_Leon_CV_ES.pdf"); modal.setAttribute("aria-hidden", "true"); };
  if (pDen) pDen.onclick = () => { downloadFile("./export/Enmanuel_Leon_CV_EN.pdf", "Enmanuel_Leon_CV_EN.pdf"); modal.setAttribute("aria-hidden", "true"); };
}

function startTyping(data) {
  const el = document.getElementById("typingText");
  const phrases =
    data.hero.typingPhrases && data.hero.typingPhrases.length
      ? data.hero.typingPhrases
      : DEFAULT_TYPING[state.lang];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  if (window.__typingTimer) {
    clearTimeout(window.__typingTimer);
  }

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx += 1;
      if (charIdx === current.length) {
        deleting = true;
        window.__typingTimer = setTimeout(type, 2000);
        return;
      }
      window.__typingTimer = setTimeout(type, 60 + Math.random() * 40);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx -= 1;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        window.__typingTimer = setTimeout(type, 500);
        return;
      }
      window.__typingTimer = setTimeout(type, 30);
    }
  }
  type();
}

function observeReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
            bar.style.width = bar.dataset.width;
          });

          entry.target
            .querySelectorAll(".stat-number[data-count]")
            .forEach((counter) => {
              if (counter.dataset.animated) return;
              counter.dataset.animated = "true";
              const target = parseInt(counter.dataset.count, 10);
              let current = 0;
              const step = target / 40;
              const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                  counter.textContent = target + "+";
                  clearInterval(interval);
                } else {
                  counter.textContent = Math.floor(current) + "+";
                }
              }, 40);
            });
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document
    .querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .stagger-children"
    )
    .forEach((el) => {
      observer.observe(el);
    });
}

/**
 * Initializes a highly refined, slow-moving ambient floating sky particle logic
 * replacing the busy "AI slop" constellation web lines with high-end minimalism.
 */
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;
  const PARTICLE_COUNT = 30; // Fewer particles for a cleaner look

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = 40; // Soft density
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12, // Softer drift
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 2.8 + 1.2, // Slightly larger, soft glowing points
        alpha: Math.random() * 0.3 + 0.1, // More visible glowing opacity
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // Is dark theme active? Let's check html attribute
    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const particleColor = isDark ? "99, 102, 241" : "79, 70, 229"; // Indigo matching our palette

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

function applyTerminalTheme(theme) {
  const container = document.querySelector(".terminal-container");
  if (!container) return;
  container.classList.remove("theme-classic-light");
  if (theme === "light") {
    container.classList.add("theme-classic-light");
  }
}

function initGlobalInteractions() {
  const nav = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const langSelect = document.getElementById("langSelect");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    
    // Dynamic Scroll Progress Bar calculation
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    const progressBar = document.getElementById("scrollProgress");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    nav.classList.toggle("scrolled", scrollY > 50);
    if (backToTop) {
      backToTop.classList.toggle("visible", scrollY > 500);
    }

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) current = section.getAttribute("id");
    });

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
    setTimeout(() => applyTerminalTheme(savedTheme), 100);
  } else {
    const systemIsLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = systemIsLight ? "light" : "dark";
    html.setAttribute("data-theme", initialTheme);
    setTimeout(() => applyTerminalTheme(initialTheme), 100);
  }

  const savedAccentTheme = localStorage.getItem("accent-theme") || "indigo";
  const accentDots = document.querySelectorAll(".accent-dot");
  
  if (savedAccentTheme && savedAccentTheme !== "indigo") {
    html.classList.add(`theme-${savedAccentTheme}`);
  }

  if (accentDots.length > 0) {
    accentDots.forEach(dot => {
      if (dot.getAttribute("data-theme") === savedAccentTheme) {
        dot.classList.add("active");
      }
      
      dot.addEventListener("click", () => {
        const themeChoice = dot.getAttribute("data-theme");
        
        accentDots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        
        html.classList.remove("theme-matrix", "theme-dracula", "theme-cyber", "theme-classic");
        if (themeChoice !== "indigo") {
          html.classList.add(`theme-${themeChoice}`);
          localStorage.setItem("accent-theme", themeChoice);
        } else {
          localStorage.removeItem("accent-theme");
        }
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      applyTerminalTheme(next);
    });
  }

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });

  if (langSelect) {
    const langButtons = langSelect.querySelectorAll(".lang-switch-btn");
    langButtons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const nextLang = btn.getAttribute("data-lang");
        if (state.lang === nextLang) return;
        
        state.lang = nextLang;
        localStorage.setItem("cv-lang", state.lang);
        await hydrate();
      });
    });
  }
}

function initTagHighlighting() {
  document.addEventListener("mouseover", (e) => {
    const tag = e.target.closest(".tag");
    if (!tag) return;
    const tagText = tag.textContent.trim().toLowerCase();
    document.querySelectorAll(".tag").forEach((t) => {
      if (t.textContent.trim().toLowerCase() === tagText) {
        t.classList.add("tag-highlight");
      }
    });
  });

  document.addEventListener("mouseout", (e) => {
    const tag = e.target.closest(".tag");
    if (!tag) return;
    document.querySelectorAll(".tag").forEach((t) => {
      t.classList.remove("tag-highlight");
    });
  });
}

function initSpotlightHighlighting() {
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".stat-card, .timeline-card, .skill-category, .edu-card, .contact-card, .modal-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
}

function initTerminal() {
  const trigger = document.getElementById("terminalTrigger");
  const overlay = document.getElementById("terminalOverlay");
  const closeBtn = document.getElementById("terminalCloseBtn");
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");

  const minBtn = document.querySelector(".t-minimize");
  const maxBtn = document.querySelector(".t-maximize");
  const container = document.querySelector(".terminal-container");
  const header = document.querySelector(".terminal-header");

  if (!trigger || !overlay || !input) return;

  const sessionStartTime = Date.now();
  let currentThemeName = "Indigo (Default)";
  const cmdHistory = JSON.parse(sessionStorage.getItem("terminal-history")) || [];
  const syncBtn = document.getElementById("terminalSyncBtn");

  function print(text, type = "normal") {
    const div = document.createElement("div");
    div.className = `terminal-line type-${type}`;
    div.innerHTML = text;
    output.appendChild(div);
    const body = document.getElementById("terminalBody");
    body.scrollTop = body.scrollHeight;
  }

  function printWelcome() {
    output.innerHTML = "";
    print("Welcome to Enmanuel's Interactive Shell (v1.0.0)", "welcome");
    print("Type <span class='cmd'>help</span> to list all available commands.", "info");
    print("");
  }

  const getVirtualFiles = () => {
    const paragraphs = state.data ? state.data.about.paragraphs.join("\n\n") : "Enmanuel Leon — Senior Fullstack Developer";
    
    let skillsStr = "--- TECHNICAL STACK ---\n";
    if (state.data) {
      state.data.skills.categories.forEach(cat => {
        skillsStr += `${cat.title}:\n`;
        const items = cat.items.map(i => `  • ${i.name} (${i.level}%)`).join("\n");
        skillsStr += `${items}\n\n`;
      });
    } else {
      skillsStr += "JavaScript, TypeScript, Node.js, React, Python, AWS, GCP, Redis, LLMs\n";
    }

    let expStr = "--- EXPERIENCE TIMELINE ---\n";
    if (state.data) {
      state.data.experience.items.forEach(job => {
        expStr += `[${job.period}] ${job.role} at ${job.company}\n`;
        job.bullets.forEach(b => {
          expStr += `  • ${b}\n`;
        });
        expStr += "\n";
      });
    } else {
      expStr += "Senior Fullstack Developer\n";
    }

    let eduStr = "--- EDUCATION ---\n";
    if (state.data && state.data.education) {
      state.data.education.items.forEach(edu => {
        eduStr += `[${edu.period}] ${edu.degree}\n  ${edu.school}\n  ${edu.description}\n\n`;
      });
    } else {
      eduStr += "Ingeniería de Computación - Universidad José Antonio Páez (2017 - 2020)\n";
    }

    let contactStr = "--- CONTACT INFORMATION ---\n";
    if (state.data && state.data.contact) {
      state.data.contact.items.forEach(item => {
        contactStr += `${item.label}: ${item.value} (${item.href})\n`;
      });
    } else {
      contactStr += "Email: enma2310@outlook.com\nLinkedIn: linkedin.com/in/enmanuel-leon-48b11714b\nGitHub: github.com/enmanuel23x\n";
    }

    const secretStr = `🔑 EASTER EGG UNLOCKED!
"Code is like humor. When you have to explain it, it's bad." — Cory House
Thanks for checking out my interactive shell. Let's build something awesome together!\n`;

    return {
      "about.txt": { content: paragraphs, size: paragraphs.length },
      "skills.txt": { content: skillsStr, size: skillsStr.length },
      "experience.txt": { content: expStr, size: expStr.length },
      "education.txt": { content: eduStr, size: eduStr.length },
      "contact.txt": { content: contactStr, size: contactStr.length },
      "secret.txt": { content: secretStr, size: secretStr.length },
      "resume.pdf": { content: "[Binary PDF Data]", size: 284201 },
      "resume.md": { content: "[Markdown Resume Data]", size: 4096 }
    };
  };

  const commands = {
    help: () => {
      print("Available commands:");
      print("  <span class='cmd'>ls [-l] [-a]</span>        - List files in current directory");
      print("  <span class='cmd'>cat &lt;file&gt;</span>         - Display content of a file (e.g. cat about.txt)");
      print("  <span class='cmd'>neofetch</span>           - Display custom system profile and statistics");
      print("  <span class='cmd'>theme &lt;name&gt;</span>       - Change CLI colors (dracula, matrix, cyber, classic, indigo)");
      print("  <span class='cmd'>whoami</span>             - Show active shell profile user name");
      print("  <span class='cmd'>pwd</span>                - Show current working directory path");
      print("  <span class='cmd'>date</span>               - Print current calendar timestamp");
      print("  <span class='cmd'>history</span>            - Show command log history");
      print("  <span class='cmd'>clear</span>              - Clear shell console");
      print("  <span class='cmd'>exit</span>               - Close terminal overlay");
    },
    ls: (args) => {
      const files = getVirtualFiles();
      const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const longFormat = args.includes("-l") || args.includes("-la") || args.includes("-al");

      if (longFormat) {
        print("total 64");
        if (showAll) {
          print("drwxr-xr-x   6 guest  staff     192 May 30 03:48 .");
          print("drwxr-xr-x   4 guest  staff     128 May 30 03:48 ..");
        }
        Object.keys(files).forEach(name => {
          const file = files[name];
          const isExec = name.endsWith(".pdf") || name.endsWith(".md");
          const colorClass = isExec ? "style='color:#22c55e'" : "";
          print(`-rw-r--r--   1 guest  staff  ${String(file.size).padStart(6, " ")} May 30 03:48 <span ${colorClass}>${name}</span>`);
        });
      } else {
        let fileNames = Object.keys(files);
        if (showAll) {
          fileNames = [".", "..", ...fileNames];
        }
        print(fileNames.join("    "));
      }
    },
    cat: (args) => {
      if (args.length === 0) {
        print("cat: missing operand", "error");
        return;
      }
      const files = getVirtualFiles();
      const filename = args[0].toLowerCase();
      
      if (files[filename]) {
        if (filename === "resume.pdf" || filename === "resume.md") {
          print("Initializing virtual download channel...");
          const lang = state.lang === "es" ? "ES" : "EN";
          if (filename === "resume.pdf") {
            print("Retrieving PDF file...");
            const triggerA = document.createElement("a");
            triggerA.href = `./export/Enmanuel_Leon_CV_${lang}.pdf`;
            triggerA.download = `Enmanuel_Leon_CV_${lang}.pdf`;
            document.body.appendChild(triggerA);
            triggerA.click();
            setTimeout(() => triggerA.remove(), 100);
          } else {
            print("Retrieving Markdown file...");
            const triggerA = document.createElement("a");
            triggerA.href = `./export/cv.${state.lang}.md`;
            triggerA.download = `Enmanuel_Leon_CV_${lang}.md`;
            document.body.appendChild(triggerA);
            triggerA.click();
            setTimeout(() => triggerA.remove(), 100);
          }
        } else {
          const formatted = files[filename].content.replace(/\n/g, "<br/>");
          print(formatted);
        }
      } else {
        print(`cat: ${escapeHtml(args[0])}: No such file or directory`, "error");
      }
    },
    neofetch: () => {
      const asciiArt = `
<span style="color:#6366f1">   ______   __      </span>
<span style="color:#6366f1">  / ____/  / /      </span>
<span style="color:#818cf8"> / __/    / /       </span>
<span style="color:#818cf8">/ /___   / /___     </span>
<span style="color:#4f46e5">/_____/ /_____/     </span>
`;
      const sysInfo = `
<span style="color:var(--accent-light);font-weight:bold">enmanuel@portfolio</span>
------------------
<span style="color:#fbbf24">OS:</span> PortfolioOS v1.0.0 (zsh shell)
<span style="color:#fbbf24">Kernel:</span> Darwin 23.0.0
<span style="color:#fbbf24">Uptime:</span> ${Math.floor((Date.now() - sessionStartTime) / 1000)}s
<span style="color:#fbbf24">Shell:</span> zsh 5.9
<span style="color:#fbbf24">Theme:</span> ${currentThemeName}
<span style="color:#fbbf24">CPU:</span> M-Series Max (Hyper-optimized)
<span style="color:#fbbf24">Stack:</span> Node, React, React Native, TS, Python, LLMs
<span style="color:#fbbf24">Contact:</span> enma2310@outlook.com
`;
      print(`<div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap"><div>${asciiArt}</div><div>${sysInfo}</div></div>`);
    },
    theme: (args) => {
      if (args.length === 0) {
        print("Usage: <span class='cmd'>theme &lt;name&gt;</span>");
        print("Available themes: <span class='cmd'>indigo</span> (default), <span class='cmd'>dracula</span>, <span class='cmd'>matrix</span>, <span class='cmd'>cyber</span>, <span class='cmd'>classic</span>");
      } else {
        const themeChoice = args[0].toLowerCase();
        const html = document.documentElement;
        const dots = document.querySelectorAll(".accent-dot");
        
        const syncDots = (selected) => {
          dots.forEach(d => {
            if (d.getAttribute("data-theme") === selected) {
              d.classList.add("active");
            } else {
              d.classList.remove("active");
            }
          });
        };

        html.classList.remove("theme-matrix", "theme-dracula", "theme-cyber", "theme-classic");
        
        if (themeChoice === "matrix") {
          html.classList.add("theme-matrix");
          localStorage.setItem("accent-theme", "matrix");
          syncDots("matrix");
          currentThemeName = "Matrix (Green)";
          print("Accent theme switched to Matrix 🟩", "welcome");
        } else if (themeChoice === "dracula") {
          html.classList.add("theme-dracula");
          localStorage.setItem("accent-theme", "dracula");
          syncDots("dracula");
          currentThemeName = "Dracula (Purple)";
          print("Accent theme switched to Dracula 🟪", "welcome");
        } else if (themeChoice === "cyber") {
          html.classList.add("theme-cyber");
          localStorage.setItem("accent-theme", "cyber");
          syncDots("cyber");
          currentThemeName = "Cyberpunk (Neon)";
          print("Accent theme switched to Cyberpunk 💖🩵", "welcome");
        } else if (themeChoice === "classic") {
          html.classList.add("theme-classic");
          localStorage.setItem("accent-theme", "classic");
          syncDots("classic");
          currentThemeName = "Classic (Slate)";
          print("Accent theme switched to Classic Gray ⬜", "welcome");
        } else if (themeChoice === "indigo" || themeChoice === "default") {
          localStorage.removeItem("accent-theme");
          syncDots("indigo");
          currentThemeName = "Indigo (Default)";
          print("Accent theme restored to Indigo Default 🟦", "welcome");
        } else {
          print(`theme: Unknown theme '${escapeHtml(args[0])}'. Type 'theme' to see options.`, "error");
        }
      }
    },
    whoami: () => {
      print("guest@enmanuel-leon-portfolio");
    },
    pwd: () => {
      print("/Users/enmanuel/portfolio");
    },
    date: () => {
      print(new Date().toString());
    },
    history: () => {
      cmdHistory.forEach((c, idx) => {
        print(`  ${String(idx + 1).padStart(3, " ")}  ${escapeHtml(c)}`);
      });
    },
    sudo: () => {
      print("sudo: guest is not in the sudoers file. This incident will be reported.", "error");
    },
    clear: () => {
      output.innerHTML = "";
    },
    exit: () => {
      overlay.setAttribute("aria-hidden", "true");
    }
  };

  const syncTerminalWithSystem = (verbose = true) => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemTheme = isDark ? "dark" : "light";
    const html = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");

    html.setAttribute("data-theme", systemTheme);
    localStorage.setItem("theme", systemTheme);
    
    // Clear custom accent themes so it restores indigo default!
    html.classList.remove("theme-matrix", "theme-dracula", "theme-cyber", "theme-classic");
    localStorage.removeItem("accent-theme");
    const dots = document.querySelectorAll(".accent-dot");
    dots.forEach(d => {
      if (d.getAttribute("data-theme") === "indigo") {
        d.classList.add("active");
      } else {
        d.classList.remove("active");
      }
    });

    applyTerminalTheme(systemTheme);

    if (verbose) {
      const modeText = isDark ? "Dark Mode 🌙" : "Light Mode ☀️";
      print(`System and terminal themes synchronized: <b>${modeText}</b>.`, "info");
    }
  };

  if (syncBtn) {
    syncBtn.onclick = (e) => {
      e.stopPropagation();
      syncTerminalWithSystem();
    };
  }

  trigger.addEventListener("click", () => {
    overlay.setAttribute("aria-hidden", "false");
    if (container) {
      container.classList.remove("minimized");
      container.classList.remove("fullscreen");
      overlay.classList.remove("minimized-mode");
    }
    printWelcome();
    const activeTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTerminalTheme(activeTheme);
    setTimeout(() => input.focus(), 150);
  });

  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      overlay.setAttribute("aria-hidden", "true");
      if (container) {
        container.classList.remove("minimized");
        container.classList.remove("fullscreen");
        overlay.classList.remove("minimized-mode");
      }
    };
  }

  if (minBtn && container) {
    minBtn.onclick = (e) => {
      e.stopPropagation();
      container.classList.remove("fullscreen");
      container.classList.toggle("minimized");
      overlay.classList.toggle("minimized-mode");
      if (!container.classList.contains("minimized")) {
        setTimeout(() => input.focus(), 100);
      }
    };
  }

  if (maxBtn && container) {
    maxBtn.onclick = (e) => {
      e.stopPropagation();
      container.classList.remove("minimized");
      overlay.classList.remove("minimized-mode");
      container.classList.toggle("fullscreen");
      setTimeout(() => input.focus(), 100);
    };
  }

  if (header && container) {
    header.onclick = (e) => {
      if (container.classList.contains("minimized")) {
        container.classList.remove("minimized");
        overlay.classList.remove("minimized-mode");
        setTimeout(() => input.focus(), 100);
      }
    };
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.setAttribute("aria-hidden", "true");
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const line = input.value.trim();
      input.value = "";
      if (!line) return;

      print(`<span class='terminal-prompt'>enmanuel@guest ~ %</span> <span class='user-input-line'>${escapeHtml(line)}</span>`);
      cmdHistory.push(line);
      sessionStorage.setItem("terminal-history", JSON.stringify(cmdHistory));
      
      const tokens = line.split(/\s+/);
      const cmd = tokens[0].toLowerCase();
      const args = tokens.slice(1);
      
      if (commands[cmd]) {
        commands[cmd](args);
      } else {
        print(`zsh: command not found: ${escapeHtml(tokens[0])}. Type 'help' for options.`, "error");
      }
    }
  });

  overlay.addEventListener("click", (e) => {
    if (container && !container.classList.contains("minimized")) {
      input.focus();
    }
  });
}

function initKeyboardShortcuts() {
  const trigger = document.getElementById("terminalTrigger");
  const overlay = document.getElementById("terminalOverlay");
  const input = document.getElementById("terminalInput");
  const themeToggle = document.getElementById("themeToggle");
  const langSelect = document.getElementById("langSelect");

  document.addEventListener("keydown", (e) => {
    // 1. Ctrl + ` (Backtick) - Toggle Terminal Overlay (VS Code Standard)
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      if (overlay) {
        const isHidden = overlay.getAttribute("aria-hidden") === "true";
        if (isHidden) {
          trigger.click();
        } else {
          overlay.setAttribute("aria-hidden", "true");
        }
      }
    }

    // 2. Escape - Minimize or Close Terminal, or Close Modal
    if (e.key === "Escape") {
      const container = document.querySelector(".terminal-container");
      if (overlay && overlay.getAttribute("aria-hidden") === "false" && container) {
        if (!container.classList.contains("minimized")) {
          // Stage 1: Minimize terminal to status bar
          container.classList.add("minimized");
          overlay.classList.add("minimized-mode");
        } else {
          // Stage 2: Close completely
          overlay.setAttribute("aria-hidden", "true");
          container.classList.remove("minimized");
          overlay.classList.remove("minimized-mode");
        }
      }
      const modal = document.getElementById("downloadModal");
      if (modal && modal.getAttribute("aria-hidden") === "false") {
        modal.setAttribute("aria-hidden", "true");
      }
    }

    // 3. Shortcuts active ONLY when terminal input has focus
    if (document.activeElement === input) {
      // Ctrl + L - Clear terminal screen (zsh Standard)
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        const output = document.getElementById("terminalOutput");
        if (output) output.innerHTML = "";
      }
      // Ctrl + D - Close terminal overlay (zsh standard exit)
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (overlay) overlay.setAttribute("aria-hidden", "true");
      }
    }

    // 4. Global hotkeys (active only when not typing inside an input)
    if (document.activeElement !== input && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      // Ctrl + Shift + T - Toggle Site Theme
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        if (themeToggle) themeToggle.click();
      }
      // Ctrl + Shift + L - Switch Page Language
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        if (langSelect) {
          const nextLang = state.lang === "es" ? "en" : "es";
          const btn = langSelect.querySelector(`.lang-switch-btn[data-lang="${nextLang}"]`);
          if (btn) btn.click();
        }
      }
    }
  });
}

async function hydrate() {
  state.data = await loadData(state.lang);
  renderStatic(state.data);
  startTyping(state.data);
  observeReveal();
}

(async function init() {
  initParticles();
  initGlobalInteractions();
  initTagHighlighting();
  initSpotlightHighlighting();
  initTerminal();
  initKeyboardShortcuts();
  try {
    await hydrate();
  } catch (error) {
    console.error(error);
  }
})();
