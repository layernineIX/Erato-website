// Nav scroll state
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Newsletter form (in-memory only, no backend yet)
const joinForm = document.getElementById('joinForm');
if (joinForm) {
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = joinForm.querySelector('input');
    input.value = '';
    input.placeholder = "You're on the list.";
  });
}
