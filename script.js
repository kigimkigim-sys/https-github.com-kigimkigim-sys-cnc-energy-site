const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const form = document.querySelector('.lead-form');
const phoneSource = new URLSearchParams(window.location.search).get('phone')
  || window.localStorage.getItem('cncDynamicPhone')
  || '74998771645';
const bgSlides = [...document.querySelectorAll('.hero-bg-slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const solutionSlides = [...document.querySelectorAll('.solution-slide')];
const solutionDots = [...document.querySelectorAll('.solution-dot')];
const objectSlides = [...document.querySelectorAll('.object-slide')];
const objectDots = [...document.querySelectorAll('.object-dot')];
let activeSlide = 0;
let activeSolutionSlide = 0;
let activeObjectSlide = 0;

function formatRussianPhone(value) {
  const digits = String(value).replace(/\D/g, '');
  const normalized = digits.length === 11 && digits[0] === '8' ? `7${digits.slice(1)}` : digits;
  if (normalized.length !== 11 || normalized[0] !== '7') return null;
  return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
}

function applyDynamicPhone(value) {
  const text = formatRussianPhone(value);
  if (!text) return;
  const tel = `tel:+${String(value).replace(/\D/g, '').replace(/^8/, '7')}`;
  window.localStorage.setItem('cncDynamicPhone', value);
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = tel;
    link.textContent = text;
  });
}

applyDynamicPhone(phoneSource);

function showSlide(index) {
  if (!bgSlides.length) return;
  activeSlide = (index + bgSlides.length) % bgSlides.length;
  bgSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === activeSlide);
  });
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.slide));
  });
});

if (bgSlides.length > 1) {
  window.setInterval(() => showSlide(activeSlide + 1), 4500);
}

function showSolutionSlide(index) {
  if (!solutionSlides.length) return;
  activeSolutionSlide = (index + solutionSlides.length) % solutionSlides.length;
  solutionSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === activeSolutionSlide);
  });
  solutionDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === activeSolutionSlide);
  });
}

solutionDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    showSolutionSlide(Number(dot.dataset.solutionSlide));
  });
});

if (solutionSlides.length > 1) {
  window.setInterval(() => showSolutionSlide(activeSolutionSlide + 1), 5000);
}

function showObjectSlide(index) {
  if (!objectSlides.length) return;
  activeObjectSlide = (index + objectSlides.length) % objectSlides.length;
  objectSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === activeObjectSlide);
  });
  objectDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === activeObjectSlide);
  });
}

objectDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    showObjectSlide(Number(dot.dataset.objectSlide));
  });
});

if (objectSlides.length > 1) {
  window.setInterval(() => showObjectSlide(activeObjectSlide + 1), 5200);
}

document.querySelectorAll('[data-mini-carousel]').forEach((carousel, carouselIndex) => {
  const slides = [...carousel.querySelectorAll('.mini-slide')];
  if (slides.length < 2) return;
  let activeMiniSlide = 0;

  window.setInterval(() => {
    activeMiniSlide = (activeMiniSlide + 1) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === activeMiniSlide);
    });
  }, 3600 + carouselIndex * 180);
});

document.querySelectorAll('.lead-form select[name="power"]').forEach((select) => {
  select.classList.add('is-native-hidden');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const custom = document.createElement('div');
  custom.className = 'power-select';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.textContent = select.options[select.selectedIndex]?.textContent || 'Пока не знаю';
  const list = document.createElement('div');
  list.className = 'power-options';

  [...select.options].forEach((option) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.textContent = option.textContent;
    item.classList.toggle('is-selected', option.selected);
    item.addEventListener('click', () => {
      select.value = option.value;
      trigger.textContent = option.textContent;
      list.querySelectorAll('button').forEach((button) => button.classList.remove('is-selected'));
      item.classList.add('is-selected');
      custom.classList.remove('is-open');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    list.append(item);
  });

  trigger.addEventListener('click', () => {
    document.querySelectorAll('.power-select.is-open').forEach((opened) => {
      if (opened !== custom) opened.classList.remove('is-open');
    });
    custom.classList.toggle('is-open');
  });

  document.addEventListener('click', (event) => {
    if (!custom.contains(event.target)) custom.classList.remove('is-open');
  });

  custom.append(trigger, list);
  select.insertAdjacentElement('afterend', custom);
});

if (form) {
  form.addEventListener('submit', () => {
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.textContent = 'Отправляем заявку...';
      button.disabled = true;
    }
  });
}
