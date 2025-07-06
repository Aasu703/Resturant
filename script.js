const ramenDishes = [
  {
    name: "Yellow Chilli Ramen",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&w=500&q=80"
  },
  {
    name: "Black Garlic Ramen",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?ixlib=rb-4.0.3&w=500&q=80"
  },
  {
    name: "Spicy Chicken Ramen",
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?ixlib=rb-4.0.3&w=500&q=80"
  }
];

let index = 0;
let isTransitioning = false;

window.addEventListener('load', () => {
  // ✅ FIX: Remove loading screen
  const loader = document.querySelector('.loading');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(() => loader.remove(), 500);
  }

  const showcase = document.createElement('div');
  showcase.className = 'showcase';

  const showcaseContent = document.createElement('div');
  showcaseContent.className = 'showcase-content';

  showcaseContent.innerHTML = `
    <img id="ramenImage" src="${ramenDishes[0].image}" alt="ramen" />
    <h1 id="ramenName">${ramenDishes[0].name}</h1>
    <div class="dish-counter">
      <span id="currentDish">1</span> of ${ramenDishes.length}
    </div>
    <button id="nextBtn">
      <span>Next Dish</span>
      <i class="fas fa-arrow-right"></i>
    </button>
  `;

  // Create progress dots
  const progressDots = document.createElement('div');
  progressDots.className = 'progress-dots';
  for (let i = 0; i < ramenDishes.length; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToDish(i));
    progressDots.appendChild(dot);
  }

  // Create floating particles
  const particles = document.createElement('div');
  particles.className = 'particles';
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 3 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particles.appendChild(particle);
  }

  showcase.appendChild(particles);
  showcase.appendChild(showcaseContent);
  showcase.appendChild(progressDots);
  document.body.appendChild(showcase);

  // Next button functionality
  document.getElementById('nextBtn').onclick = () => {
    if (!isTransitioning) {
      nextDish();
    }
  };

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      if (!isTransitioning) {
        nextDish();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (!isTransitioning) {
        prevDish();
      }
    }
  });

  // Auto-advance after 4 seconds if no interaction
  let autoAdvanceTimer = setTimeout(() => {
    if (!isTransitioning) {
      nextDish();
    }
  }, 4000);

  // Reset auto-advance on user interaction
  showcase.addEventListener('click', () => {
    clearTimeout(autoAdvanceTimer);
  });
});

function nextDish() {
  const nextIndex = (index + 1) % ramenDishes.length;
  changeDish(nextIndex);
}

function prevDish() {
  const prevIndex = (index - 1 + ramenDishes.length) % ramenDishes.length;
  changeDish(prevIndex);
}

function goToDish(targetIndex) {
  if (targetIndex !== index && !isTransitioning) {
    changeDish(targetIndex);
  }
}

function changeDish(targetIndex) {
  if (isTransitioning) return;

  isTransitioning = true;
  const showcaseContent = document.querySelector('.showcase-content');
  const dots = document.querySelectorAll('.dot');
  const image = document.getElementById('ramenImage');

  // Add pulse effect to current image
  image.style.transform = 'scale(1.1)';

  // Start slide-out animation
  showcaseContent.classList.add('slide-out');

  setTimeout(() => {
    // Update content
    index = targetIndex;
    image.src = ramenDishes[index].image;
    document.getElementById('ramenName').textContent = ramenDishes[index].name;
    document.getElementById('currentDish').textContent = index + 1;

    // Update progress dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Start slide-in animation
    showcaseContent.classList.remove('slide-out');
    showcaseContent.classList.add('slide-in');

    setTimeout(() => {
      showcaseContent.classList.remove('slide-in');
      image.style.transform = 'scale(1)';
      isTransitioning = false;

      // Check if we've completed a full cycle
      if (index === 0 && document.querySelector('.showcase')) {
        // Add completion indicator
        const completionIndicator = document.querySelector('.completion-indicator');
        if (!completionIndicator) {
          const indicator = document.createElement('div');
          indicator.className = 'completion-indicator';
          indicator.innerHTML = '✨ Complete! Entering Restaurant...';
          document.querySelector('.showcase').appendChild(indicator);
        }

        setTimeout(() => {
          exitShowcase();
        }, 2000);
      }
    }, 600);
  }, 300);
}

function exitShowcase() {
  const showcase = document.querySelector('.showcase');
  showcase.classList.add('fade-out');

  setTimeout(() => {
    showcase.remove();

    // Show main content with staggered animation
    const elementsToShow = [
      document.querySelector('header'),
      document.querySelector('.hero'),
      ...document.querySelectorAll('.section'),
      document.querySelector('footer')
    ];

    elementsToShow.forEach((el, i) => {
      if (el) {
        setTimeout(() => {
          el.style.display = el.tagName === 'HEADER' ? 'flex' : 'block';
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 50);
        }, i * 150);
      }
    });
  }, 800);

  // Add welcome sound effect (optional)
  playWelcomeSound();
}

function playWelcomeSound() {
  // Create a simple audio context for a subtle welcome chime
  if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
    const AudioContextClass = AudioContext || webkitAudioContext;
    const audioContext = new AudioContextClass();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}

// Hide loading screen after content is loaded

window.addEventListener("load", () => {
    const loadingScreen = document.querySelector(".loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }
  });