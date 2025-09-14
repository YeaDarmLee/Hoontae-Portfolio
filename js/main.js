// Main JavaScript for Bassist Profile E-book
class ProfileEbook {
  constructor() {
    this.currentPage = 0;
    this.totalPages = 10;

    // --- gesture/scroll states ---
    this.isScrolling = false;        // 스크롤 애니메이션 진행 중 락
    this.gestureLockDir = null;      // 'next' | 'prev' | null (연속 제스처 방향 고정)
    this.wheelCooldown = false;      // 휠 연타 쿨다운
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.currentTheme = 'minimal';
    this.testimonialIndex = 0;
    this.testimonials = [];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.generateNavigationIndicators();
    this.setupTestimonials();
    this.showSwipeHint();
    this.setupKeyboardNavigation();
    this.setupAccessibility();
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Touch / Wheel on page container
    const pageContainer = document.getElementById('page-container');
    if (pageContainer) {
      pageContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      pageContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

      pageContainer.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

      // ---- 실제 스크롤 종료 시점 감지 ----
      // 1) 지원 시 scrollend 사용
      if ('onscrollend' in window || 'onscrollend' in document) {
        pageContainer.addEventListener('scrollend', () => { this.isScrolling = false; }, { passive: true });
      }

      // 2) 폴백: 스크롤 디바운스
      let scrollEndTimer = null;
      pageContainer.addEventListener('scroll', () => {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => { this.isScrolling = false; }, 120);
      }, { passive: true });
    }

    // Testimonial navigation
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    if (testimonialPrev) testimonialPrev.addEventListener('click', () => this.previousTestimonial());
    if (testimonialNext) testimonialNext.addEventListener('click', () => this.nextTestimonial());

    // Live clip interactions
    this.setupLiveClips();

    // Form submission
    this.setupFormSubmission();

    // Share functionality
    this.setupShareFunctionality();
  }

  generateNavigationIndicators() {
    const indicatorsContainer = document.getElementById('nav-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < this.totalPages; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'nav-indicator';
      indicator.setAttribute('aria-label', `페이지 ${i + 1}로 이동`);
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

      if (i === 0) {
        indicator.classList.add('active');
      }

      indicator.addEventListener('click', () => this.goToPage(i));
      indicatorsContainer.appendChild(indicator);
    }
  }

  setupTestimonials() {
    this.testimonials = document.querySelectorAll('.testimonial');
    if (this.testimonials.length > 0) {
      this.showTestimonial(0);
    }
  }

  showSwipeHint() {
    const swipeHint = document.getElementById('swipe-hint');
    if (!swipeHint) return;

    // Show hint for 3 seconds on first visit
    setTimeout(() => {
      swipeHint.style.display = 'none';
    }, 3000);
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextPage();
          break;
        case 'Home':
          e.preventDefault();
          this.goToPage(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToPage(this.totalPages - 1);
          break;
      }
    });
  }

  setupAccessibility() {
    // Add ARIA labels and roles
    const pageContainer = document.getElementById('page-container');
    if (pageContainer) {
      pageContainer.setAttribute('role', 'tabpanel');
      pageContainer.setAttribute('aria-label', '프로필 페이지');
    }

    // Update page indicators with proper ARIA attributes
    this.updatePageIndicators();
  }

  // -------------------
  // Gesture handlers
  // -------------------
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    // 새로운 제스처 시작 시 방향 락 해제
    this.gestureLockDir = null;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleWheel(e) {
    // 진행 중이거나 쿨다운 중이면 무시
    if (this.isScrolling || this.wheelCooldown) return;

    const currentPage = document.querySelector(`.page[data-page="${this.currentPage}"]`);
    const isScrollable = currentPage && currentPage.scrollHeight > currentPage.clientHeight;

    // 세로 스크롤이 가능한 페이지에서, 수직 움직임이 더 크면 기본 스크롤 허용
    if (isScrollable && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      return;
    }

    // 가로 넘김으로 해석되는 경우만 기본 스크롤 막음
    e.preventDefault();

    const dir = (e.deltaX > 0 || e.deltaY > 0) ? 'next' : 'prev';

    // 기존에 고정된 방향이 있고, 반대 방향이면 무시 (튕김 방지)
    if (this.gestureLockDir && this.gestureLockDir !== dir) return;

    this.gestureLockDir = dir;
    this.wheelCooldown = true;

    dir === 'next' ? this.nextPage() : this.previousPage();

    // 관성/스무스 스크롤보다 살짝 길게 쿨다운
    setTimeout(() => {
      this.wheelCooldown = false;
      this.gestureLockDir = null;
    }, 450);
  }

  handleSwipe() {
    // 스와이프 민감도 (기존 50 → 100 권장)
    const swipeThreshold = 100;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      const dir = diff > 0 ? 'next' : 'prev';

      // 이미 반대 방향으로 잠겨있으면 무시
      if (this.gestureLockDir && this.gestureLockDir !== dir) return;

      this.gestureLockDir = dir;
      dir === 'next' ? this.nextPage() : this.previousPage();

      // 터치 제스처는 비교적 짧으니 빠르게 해제
      setTimeout(() => { this.gestureLockDir = null; }, 300);
    }
  }

  // -------------------
  // Page navigation
  // -------------------
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToPage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= this.totalPages || this.isScrolling) return;

    this.isScrolling = true;
    this.currentPage = pageIndex;

    const pageContainer = document.getElementById('page-container');
    if (pageContainer) {
      pageContainer.scrollTo({
        left: pageIndex * window.innerWidth,
        behavior: 'smooth'
      });
    }

    this.updatePageIndicators();
    this.updateNavigationButtons();
    this.updatePageTitle();

    // 안전망 타이머: 일부 브라우저에서 scrollend/디바운스가 누락될 때 대비
    setTimeout(() => {
      this.isScrolling = false;
    }, 700);
  }

  updatePageIndicators() {
    const indicators = document.querySelectorAll('.nav-indicator');
    indicators.forEach((indicator, index) => {
      const isActive = index === this.currentPage;
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-selected', isActive);
    });
  }

  updateNavigationButtons() {
    // Navigation buttons are hidden; nothing to update.
  }

  updatePageTitle() {
    const pageTitles = [
      '커버 - 김홍태',
      '아티스트 소개',
      '시그니처 사운드',
      '하이라이트',
      '라이브 클립',
      '디스코그래피',
      '장비',
      '추천사',
      '연락처',
      '마무리'
    ];

    document.title = `${pageTitles[this.currentPage]} - 베이시스트 프로필`;
  }

  toggleTheme() {
    const minimalStyle = document.getElementById('minimal-style');
    const neonStyle = document.getElementById('neon-style');
    const themeIcon = document.querySelector('.theme-icon');

    if (this.currentTheme === 'minimal') {
      minimalStyle.disabled = true;
      neonStyle.disabled = false;
      this.currentTheme = 'neon';
      themeIcon.textContent = '☀️';
    } else {
      minimalStyle.disabled = false;
      neonStyle.disabled = true;
      this.currentTheme = 'minimal';
      themeIcon.textContent = '🌙';
    }

    // Save theme preference
    localStorage.setItem('theme', this.currentTheme);
  }

  setupLiveClips() {
    const liveClips = document.querySelectorAll('.live-clip');
    liveClips.forEach(clip => {
      clip.addEventListener('click', () => {
        // In a real implementation, this would open a video modal or redirect to YouTube
        console.log('Live clip clicked:', clip.querySelector('p').textContent);
      });
    });
  }

  setupFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission(contactForm);
      });
    }
  }

  handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';

    // Simulate form submission (replace with actual Formspree endpoint)
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          this.showMessage('메시지가 성공적으로 전송되었습니다!', 'success');
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(() => {
        this.showMessage('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = '전송';
      });
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 1rem 2rem;
      border-radius: 10px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideDown 0.3s ease;
    `;

    if (type === 'success') {
      messageDiv.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
      messageDiv.style.backgroundColor = '#f44336';
    } else {
      messageDiv.style.backgroundColor = '#333';
    }

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  setupShareFunctionality() {
    // Share button functionality
    window.sharePage = () => {
      if (navigator.share) {
        navigator.share({
          title: '베이시스트 프로필 - 김홍태',
          text: '김홍태의 베이시스트 프로필을 확인해보세요!',
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          this.showMessage('링크가 클립보드에 복사되었습니다!', 'success');
        });
      }
    };

    // Bookmark functionality
    window.bookmarkPage = () => {
      if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel(document.title, window.location.href, '');
      } else if (window.external && ('AddFavorite' in window.external)) {
        // Internet Explorer
        window.external.AddFavorite(window.location.href, document.title);
      } else {
        // Other browsers
        this.showMessage('Ctrl+D를 눌러 북마크에 추가하세요!', 'info');
      }
    };
  }

  previousTestimonial() {
    if (this.testimonials.length === 0) return;

    this.testimonialIndex = (this.testimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.showTestimonial(this.testimonialIndex);
  }

  nextTestimonial() {
    if (this.testimonials.length === 0) return;

    this.testimonialIndex = (this.testimonialIndex + 1) % this.testimonials.length;
    this.showTestimonial(this.testimonialIndex);
  }

  showTestimonial(index) {
    this.testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });
  }

  // Utility function for external page navigation
  scrollToPage(pageIndex) {
    this.goToPage(pageIndex);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new ProfileEbook();

  // Load saved theme preference (default to dark theme)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'minimal') {
    app.toggleTheme();
  }

  // Make app globally available for external functions
  window.profileEbook = app;
});

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  .message {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;
document.head.appendChild(style);
