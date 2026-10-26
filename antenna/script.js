const dialog = document.querySelector('#figure-dialog');
const enlargedImage = document.querySelector('#enlarged-figure');
const enlargedCaption = document.querySelector('#enlarged-caption');

document.querySelectorAll('.figure-image').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    const caption = button.closest('figure').querySelector('figcaption');
    enlargedImage.src = image.src;
    enlargedImage.alt = image.alt;
    enlargedCaption.textContent = `${caption.querySelector('.figure-number').textContent} — ${caption.querySelector('h3').textContent}. ${caption.querySelector('p').textContent}`;
    dialog.showModal();
  });
});

dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

const track = document.querySelector('#figure-track');
const slides = [...track.querySelectorAll('.figure-slide')];
const previousButton = document.querySelector('#previous-figure');
const nextButton = document.querySelector('#next-figure');
const counter = document.querySelector('#figure-counter');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const backgroundVideo = document.querySelector('#background-video');
function updateBackgroundPlayback() {
  backgroundVideo.muted = true;
  if (reducedMotion.matches) backgroundVideo.pause();
  else backgroundVideo.play().catch(() => {});
}
reducedMotion.addEventListener('change', updateBackgroundPlayback);
updateBackgroundPlayback();

let currentIndex = 0;
let scrollTimer;

function updateNavigation(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));
  counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  previousButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === slides.length - 1;
}

function goToFigure(index) {
  updateNavigation(index);
  track.scrollTo({
    left: currentIndex * track.clientWidth,
    behavior: reducedMotion.matches ? 'instant' : 'smooth',
  });
}

previousButton.addEventListener('click', () => goToFigure(currentIndex - 1));
nextButton.addEventListener('click', () => goToFigure(currentIndex + 1));

track.addEventListener('scroll', () => {
  window.clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(() => {
    updateNavigation(Math.round(track.scrollLeft / track.clientWidth));
  }, 120);
}, { passive: true });

track.addEventListener('keydown', (event) => {
  if (event.target !== track) return;
  const destinations = {
    ArrowLeft: currentIndex - 1,
    ArrowRight: currentIndex + 1,
    Home: 0,
    End: slides.length - 1,
  };
  if (!(event.key in destinations)) return;
  event.preventDefault();
  goToFigure(destinations[event.key]);
});

new ResizeObserver(() => {
  track.scrollTo({ left: currentIndex * track.clientWidth, behavior: 'instant' });
}).observe(track);
