// Toggle mobile navigation menu
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.main-nav').classList.toggle('open');
});
// Initialize AOS library for scroll animations
AOS.init({
  once: true   // animate only once when in view
});
