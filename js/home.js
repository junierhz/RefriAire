/**
 * Refriaire Integral - Home Page JavaScript (v3 ADJUSTMENTS)
 * Handles 3-Banner Hero Slider (drag/swipe/lines) & Continuous Auto-scroll Carousels
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initFeaturedProductsSlider();
  initLgAutoCarousel();
});

// 1. Hero Banner Slider (3 Banners, Mouse Drag, Touch Swipe & Line Progress)
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const lineItems = document.querySelectorAll('.hero-line-item');
  const sliderContainer = document.querySelector('.hero-slider-section');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideDuration = 6000;

  function goToSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });

    lineItems.forEach((line, idx) => {
      line.classList.toggle('active', idx === index);
      const progress = line.querySelector('.hero-line-progress');
      if (progress) {
        progress.style.width = idx === index ? '100%' : '0%';
      }
    });

    currentIndex = index;
    resetAutoplay();
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, slideDuration);
  }

  // Click on line indicators
  lineItems.forEach((line, index) => {
    line.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // Touch Swipe Support (Mobile)
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture(touchStartX, touchEndX);
    }, { passive: true });

    // Mouse Drag Support (Desktop)
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseEndX = 0;

    sliderContainer.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
      clearInterval(autoplayTimer);
    });

    sliderContainer.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      mouseEndX = e.clientX;
      handleGesture(mouseStartX, mouseEndX);
      resetAutoplay();
    });

    sliderContainer.addEventListener('mouseleave', () => {
      if (isMouseDown) {
        isMouseDown = false;
        resetAutoplay();
      }
    });
  }

  function handleGesture(start, end) {
    const diff = start - end;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Start with Banner 1
  goToSlide(0);
}

// 2. Featured Products Slider (Autoplay + Working Manual Prev/Next Buttons)
function initFeaturedProductsSlider() {
  const wrapper = document.querySelector('.featured-slider-wrapper');
  if (!wrapper) return;

  const track = wrapper.querySelector('.product-slider-track');
  const prevBtn = document.getElementById('featuredPrevBtn');
  const nextBtn = document.getElementById('featuredNextBtn');

  if (!track) return;

  const scrollAmount = 300;
  let isHovered = false;
  let autoScrollInterval = null;

  function doScrollNext() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 15) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function doScrollPrev() {
    if (track.scrollLeft <= 15) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      doScrollPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      doScrollNext();
    });
  }

  function startAutoplay() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      if (!isHovered) {
        doScrollNext();
      }
    }, 4500);
  }

  wrapper.addEventListener('mouseenter', () => { isHovered = true; });
  wrapper.addEventListener('mouseleave', () => { isHovered = false; });
  wrapper.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  wrapper.addEventListener('touchend', () => { 
    setTimeout(() => { isHovered = false; }, 2000);
  }, { passive: true });

  startAutoplay();
}

// 3. LG Subbrand Automatic Carousel (Continuous smooth loop displacement, no manual buttons)
function initLgAutoCarousel() {
  const wrapper = document.querySelector('.lg-slider-wrapper');
  if (!wrapper) return;

  const track = wrapper.querySelector('.product-slider-track');
  if (!track) return;

  let isHovered = false;
  const step = 280;
  let lgInterval = null;

  function scrollLg() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 15) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
  }

  function startLgLoop() {
    clearInterval(lgInterval);
    lgInterval = setInterval(() => {
      if (!isHovered) {
        scrollLg();
      }
    }, 3800);
  }

  wrapper.addEventListener('mouseenter', () => { isHovered = true; });
  wrapper.addEventListener('mouseleave', () => { isHovered = false; });
  wrapper.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  wrapper.addEventListener('touchend', () => {
    setTimeout(() => { isHovered = false; }, 2000);
  }, { passive: true });

  startLgLoop();
}
