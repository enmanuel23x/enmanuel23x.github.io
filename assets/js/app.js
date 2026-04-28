const LANGUAGES = ["es", "en"];
const NAV_SECTIONS = [
  "hero",
  "about",
  "experience",
  "skills",
  "education",
  "contact",
];

const state = {
  currentLang: navigator.language && navigator.language.startsWith("es") ? "es" : "en",
  data: null,
  typewriterToken: 0,
};

function q(id) {
  return document.getElementById(id);
}

async function loadCv(lang) {
  const response = await fetch(`data/cv.${lang}.json`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load CV data for language: ${lang}`);
  }
  return response.json();
}

function setActiveLanguage(lang) {
  LANGUAGES.forEach((code) => {
    const btn = q(`btn-${code}`);
    if (!btn) return;
    btn.classList.toggle("active", code === lang);
  });
  document.documentElement.lang = lang;
}

function renderNav(data) {
  q("nav-brand").textContent = data.nav.brand;
  const navLinks = q("nav-links");
  navLinks.innerHTML = "";

  data.nav.items.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${item.id}`;
    a.textContent = item.label;
    li.appendChild(a);
    navLinks.appendChild(li);
  });
}

function renderHero(data) {
  q("hero-badge").textContent = data.hero.badge;
  q("hero-photo").src = data.profile.photo;
  q("hero-photo").alt = data.profile.name;
  q("hero-name").textContent = data.profile.name;
  q("hero-role").textContent = data.profile.role;
  q("hero-summary").textContent = data.hero.summary;

  const actions = q("hero-actions");
  actions.innerHTML = "";
  data.hero.actions.forEach((action, index) => {
    const a = document.createElement("a");
    a.href = action.href;
    a.textContent = action.label;
    a.className = `btn ${index === 0 ? "primary" : "secondary"}`;
    actions.appendChild(a);
  });
}

function renderAbout(data) {
  q("about-label").textContent = data.about.label;
  q("about-title").textContent = data.about.title;
  const copy = q("about-copy");
  copy.innerHTML = "";
  data.about.paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    copy.appendChild(p);
  });

  const stats = q("stats-grid");
  stats.innerHTML = "";
  data.about.stats.forEach((stat) => {
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `
      <p class="stat-number" data-count="${stat.value}">0</p>
      <p class="stat-label">${stat.label}</p>
    `;
    stats.appendChild(card);
  });
}

function renderExperience(data) {
  q("experience-label").textContent = data.experience.label;
  q("experience-title").textContent = data.experience.title;
  q("experience-subtitle").textContent = data.experience.subtitle;

  const list = q("experience-list");
  list.innerHTML = "";
  data.experience.items.forEach((job) => {
    const card = document.createElement("article");
    card.className = "timeline-card reveal";

    const bulletsId = `bullets-${job.id}`;
    card.innerHTML = `
      <div class="timeline-meta">
        <span>${job.period}</span>
        <span>${job.location}</span>
      </div>
      <h3 class="timeline-role">${job.role}</h3>
      <p class="timeline-company">${job.company}</p>
      <ul class="timeline-bullets" id="${bulletsId}"></ul>
      <div class="timeline-tags">${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    `;

    list.appendChild(card);
  });
}

function renderSkills(data) {
  q("skills-label").textContent = data.skills.label;
  q("skills-title").textContent = data.skills.title;

  const grid = q("skills-grid");
  grid.innerHTML = "";

  data.skills.categories.forEach((category) => {
    const card = document.createElement("article");
    card.className = "skill-card reveal";

    const items = category.items
      .map(
        (item) => `
          <li>
            <div class="skill-row">
              <span>${item.name}</span>
              <span>${item.level}%</span>
            </div>
            <div class="skill-bar"><div class="skill-fill" data-width="${item.level}%"></div></div>
          </li>
        `,
      )
      .join("");

    card.innerHTML = `
      <div class="skill-header">
        <h3 class="skill-title">${category.title}</h3>
      </div>
      <ul class="skill-list">${items}</ul>
    `;

    grid.appendChild(card);
  });
}

function renderEducation(data) {
  q("education-label").textContent = data.education.label;
  q("education-title").textContent = data.education.title;

  const grid = q("education-grid");
  grid.innerHTML = "";

  data.education.items.forEach((edu) => {
    const card = document.createElement("article");
    card.className = "edu-card reveal";
    card.innerHTML = `
      <p class="edu-year">${edu.period}</p>
      <h3 class="edu-degree">${edu.degree}</h3>
      <p class="edu-school">${edu.school}</p>
      <p class="edu-school">${edu.description}</p>
    `;
    grid.appendChild(card);
  });
}

function renderContact(data) {
  q("contact-label").textContent = data.contact.label;
  q("contact-title").textContent = data.contact.title;
  q("contact-subtitle").textContent = data.contact.subtitle;

  const grid = q("contact-grid");
  grid.innerHTML = "";

  data.contact.items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "contact-card reveal";
    const value = item.href
      ? `<a href="${item.href}" class="contact-value" target="${item.external ? "_blank" : "_self"}" rel="${item.external ? "noopener noreferrer" : ""}">${item.value}</a>`
      : `<p class="contact-value">${item.value}</p>`;

    card.innerHTML = `
      <p class="contact-label">${item.label}</p>
      ${value}
    `;
    grid.appendChild(card);
  });

  const footerYear = new Date().getFullYear();
  q("footer-text").textContent = data.footer.replace("{year}", footerYear);
}

function setupBackToTop() {
  const button = q("backToTop");
  window.addEventListener("scroll", () => {
    button.classList.toggle("visible", window.scrollY > 420);
    q("navbar").classList.toggle("scrolled", window.scrollY > 24);

    const current = NAV_SECTIONS.reduce((acc, sectionId) => {
      const section = q(sectionId);
      if (!section) return acc;
      const top = section.offsetTop - 120;
      return window.scrollY >= top ? sectionId : acc;
    }, "hero");

    document.querySelectorAll("#nav-links a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupRevealAndBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");

        entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width;
        });

        entry.target.querySelectorAll(".stat-number[data-count]").forEach((counter) => {
          if (counter.dataset.animated) return;
          counter.dataset.animated = "1";
          const target = Number(counter.dataset.count);
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 35));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.textContent = `${target}+`;
              clearInterval(timer);
              return;
            }
            counter.textContent = `${current}+`;
          }, 26);
        });
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal, .timeline-card").forEach((el) => observer.observe(el));
}

async function typeWriter(el, text, speed, token) {
  el.textContent = "";
  el.classList.add("cursor");
  for (const char of text) {
    if (state.typewriterToken !== token) return;
    el.textContent += char;
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
  if (state.typewriterToken === token) {
    el.classList.remove("cursor");
  }
}

async function runTypewriter(data) {
  state.typewriterToken += 1;
  const token = state.typewriterToken;

  await typeWriter(q("hero-typing"), data.hero.typingLine, 22, token);
  if (token !== state.typewriterToken) return;

  for (const job of data.experience.items) {
    const ul = q(`bullets-${job.id}`);
    if (!ul) continue;
    ul.innerHTML = "";
    for (const bullet of job.bullets) {
      if (token !== state.typewriterToken) return;
      const li = document.createElement("li");
      ul.appendChild(li);
      await typeWriter(li, bullet, 14, token);
    }
  }
}

async function renderLanguage(lang) {
  state.data = await loadCv(lang);
  setActiveLanguage(lang);

  renderNav(state.data);
  renderHero(state.data);
  renderAbout(state.data);
  renderExperience(state.data);
  renderSkills(state.data);
  renderEducation(state.data);
  renderContact(state.data);
  setupRevealAndBars();
  runTypewriter(state.data);
}

function bindLanguageEvents() {
  LANGUAGES.forEach((lang) => {
    const btn = q(`btn-${lang}`);
    btn.addEventListener("click", async () => {
      if (state.currentLang === lang) return;
      state.currentLang = lang;
      localStorage.setItem("cv-lang", lang);
      await renderLanguage(lang);
    });
  });
}

async function init() {
  const saved = localStorage.getItem("cv-lang");
  if (saved && LANGUAGES.includes(saved)) {
    state.currentLang = saved;
  }

  bindLanguageEvents();
  setupBackToTop();

  try {
    await renderLanguage(state.currentLang);
  } catch (err) {
    q("hero-name").textContent = "Error loading CV";
    q("hero-summary").textContent = "Please refresh the page or try later.";
    console.error(err);
  }
}

init();
