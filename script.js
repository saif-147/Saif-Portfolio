const preloader = document.getElementById('preloader');
const preloaderText = document.getElementById('preloaderText');
const siteTitle = document.getElementById('siteTitle');
const page = document.getElementById('page');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const langToggle = document.getElementById('langToggle');
const projectsGrid = document.getElementById('projectsGrid');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');
const yearEl = document.getElementById('year');
const langOverlay = document.getElementById('langOverlay');

yearEl.textContent = new Date().getFullYear();

// Preloader
window.addEventListener('load', async () => {
  siteTitle.style.opacity = '0';
  const startRect = preloaderText.getBoundingClientRect();
  const endRect = siteTitle.getBoundingClientRect();

  setTimeout(async () => {
    const dx = endRect.left - startRect.left;
    const dy = endRect.top - startRect.top;
    const sx = endRect.width / startRect.width;
    const sy = endRect.height / startRect.height;

    preloaderText.style.transform = `translate(${dx}px, ${dy}px) scale(${sx},${sy})`;
    preloaderText.style.opacity = '0.95';

    setTimeout(async () => {
      preloader.style.display = 'none';
      siteTitle.style.opacity = '1';
      page.style.opacity = '1';
      await renderProjects();
    }, 800);
  }, 1000);
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeIcon.textContent = document.body.classList.contains('light') ? '🌜' : '🌞';
});

// Language toggle
let currentLang = 'en';
langToggle.addEventListener('click', async () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  langToggle.textContent = currentLang === 'en' ? 'AR' : 'EN';

  langOverlay.classList.add('show');
  const texts = document.querySelectorAll('[data-text-en]');
  texts.forEach(el => el.style.opacity = '0');

  setTimeout(async () => {
    texts.forEach(el => {
      el.textContent = el.dataset[`text${currentLang === 'en' ? 'En' : 'Ar'}`];
      el.style.opacity = '1';
    });
    await renderProjects();
    setTimeout(() => langOverlay.classList.remove('show'), 300);
  }, 300);
});

// Fetch Projects from JSON
async function getProjects() {
  try {
    const response = await fetch('projects.json');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to load projects.json", err);
    return [];
  }
}

async function renderProjects() {
  projectsGrid.innerHTML = '';
  const data = await getProjects();
  if (!data.length) {
    projectsGrid.innerHTML = '<p style="text-align:center;opacity:.6">No projects yet.</p>';
    return;
  }

  data.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="">
      <div class="card-body">
        <h3 data-text-en="${p.name}" data-text-ar="${p.nameAr}">
          ${currentLang === 'en' ? p.name : p.nameAr}
        </h3>
      </div>
    `;
    card.onclick = () => {
      modal.classList.add('show');
      modalImg.src = p.image;
      modalTitle.dataset.textEn = p.name;
      modalTitle.dataset.textAr = p.nameAr;
      modalDesc.dataset.textEn = p.descEn;
      modalDesc.dataset.textAr = p.descAr;
      modalTitle.textContent = currentLang === 'en' ? p.name : p.nameAr;
      modalDesc.textContent = currentLang === 'en' ? p.descEn : p.descAr;
      modalLink.href = p.url;
    };
    projectsGrid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), 100);
  });
}

// Modal
modalClose.onclick = () => modal.classList.remove('show');
modal.querySelector('.modal-backdrop')?.addEventListener('click', () => modal.classList.remove('show'));
