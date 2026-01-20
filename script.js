(function () {
  // ====== Theme ======
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(prefersLight ? "light" : "dark");
  }

  themeToggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // ====== Mobile Nav ======
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // close menu when clicking a link (mobile)
  navMenu?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // ====== Projects filter + search ======
  const filterButtons = Array.from(document.querySelectorAll(".filter"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const searchInput = document.getElementById("projectSearch");

  let activeFilter = "all";
  let searchQuery = "";

  function matchesFilter(card) {
    if (activeFilter === "all") return true;
    const tags = (card.getAttribute("data-tags") || "").split(" ").map((t) => t.trim());
    return tags.includes(activeFilter);
  }

  function matchesSearch(card) {
    if (!searchQuery) return true;
    const text = card.innerText.toLowerCase();
    return text.includes(searchQuery);
  }

  function renderProjects() {
    projectCards.forEach((card) => {
      const show = matchesFilter(card) && matchesSearch(card);
      card.style.display = show ? "" : "none";
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      activeFilter = btn.dataset.filter || "all";
      renderProjects();
    });
  });

  searchInput?.addEventListener("input", (e) => {
    searchQuery = (e.target.value || "").trim().toLowerCase();
    renderProjects();
  });

  // ====== Contact form: mailto fallback ======
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim() || "";
    const message = document.getElementById("message")?.value?.trim() || "";

    const subject = encodeURIComponent(`Portfolio message from ${name || "Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    // Replace with your email
    const yourEmail = "yourname@email.com";
    window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
  });

  // ====== Footer year ======
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
