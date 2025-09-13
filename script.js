// Basic navigation, dark mode, skills animation, projects filter and contact validation

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const pages = document.querySelectorAll('.page');
  const brand = document.getElementById('brand-name');
  const yearEl = document.getElementById('year');
  const darkToggle = document.getElementById('darkToggle');

  // show year
  yearEl.textContent = new Date().getFullYear();

  // nav handler
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const page = tab.getAttribute('data-page');
      setActiveTab(page);
      // smooth focus
      const el = document.querySelector(`[data-page="${page}"]`);
      if(el) el.scrollIntoView({behavior:'smooth'});
    });
  });

  function setActiveTab(pageName) {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-page') === pageName));
    pages.forEach(p => p.hidden = (p.getAttribute('data-page') !== pageName));
    // animate skill bars when opening skills
    if(pageName === 'skills') animateSkills();
  }

  // initial
  setActiveTab('about');

  // dark mode
  const storedTheme = localStorage.getItem('theme');
  if(storedTheme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  darkToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if(isDark){
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme','light');
      darkToggle.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme','dark');
      localStorage.setItem('theme','dark');
      darkToggle.textContent = '☀️';
    }
  });

  // Skills animation
  function animateSkills(){
    const bars = document.querySelectorAll('.progress-bar');
    bars.forEach(bar => {
      const target = bar.dataset.target || bar.getAttribute('data-target') || 0;
      // animate with small delay
      setTimeout(() => bar.style.width = target + '%', 120);
    });
  }

  // Projects filter
  const filter = document.getElementById('projectFilter');
  filter.addEventListener('change', (e) => {
    const val = e.target.value;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = (val === 'all' || card.dataset.category === val) ? '' : 'none';
    });
  });

  // Contact form - client-side validation and mailto fallback
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const msg = contactForm.message.value.trim();
    if(name.length < 2){ formStatus.textContent = 'Enter a valid name.'; formStatus.style.color = 'crimson'; return; }
    if(!validateEmail(email)){ formStatus.textContent = 'Enter a valid email.'; formStatus.style.color = 'crimson'; return; }
    if(msg.length < 6){ formStatus.textContent = 'Message too short.'; formStatus.style.color = 'crimson'; return; }

    // If you have a backend endpoint you can send via fetch here.
    // For now we fallback to opening a mailto link for demo.
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;

    formStatus.textContent = 'Opening mail client...';
    formStatus.style.color = 'green';
  });

  function validateEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  // Visitor counter (per browser)
  const visitKey = 'portfolio_visits';
  const visits = Number(localStorage.getItem(visitKey) || 0) + 1;
  localStorage.setItem(visitKey, String(visits));
  const visitCount = document.getElementById('visitCount');
  if(visitCount) visitCount.textContent = visits;

  // Keyboard nav: numbers 1..5 switch tabs
  document.addEventListener('keydown', (ev) => {
    if(ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA') return;
    if(ev.key >= '1' && ev.key <= '5'){
      const index = parseInt(ev.key,10) - 1;
      const t = document.querySelectorAll('.tab')[index];
      if(t) t.click();
    }
  });

  // small helper: nav by internal links
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (ev) => {
      const target = ev.currentTarget.getAttribute('data-nav');
      setActiveTab(target);
    });
  });
});
