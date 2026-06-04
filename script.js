

// 项目画廊滑动功能
class ProjectGallery {
    constructor(galleryId) {
        this.container = document.getElementById(`gallery-${galleryId}`);
        if (!this.container) return;
        
        this.track = this.container.querySelector('.gallery-track');
        this.slides = this.container.querySelectorAll('.gallery-slide');
        this.prevBtn = document.querySelector(`.gallery-btn.prev[data-gallery="${galleryId}"]`);
        this.nextBtn = document.querySelector(`.gallery-btn.next[data-gallery="${galleryId}"]`);
        this.dots = document.querySelectorAll(`.gallery-dots[data-gallery="${galleryId}"] .dot`);
        this.counter = document.querySelector(`.gallery-counter[data-gallery="${galleryId}"] span`);
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
        
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        this.container.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.container.setAttribute('tabindex', '0');
        
        this.update();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.update();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.update();
    }
    
    goTo(index) {
        this.currentIndex = index;
        this.update();
    }
    
    update() {
        if (this.track) {
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        if (this.counter) {
            this.counter.textContent = this.currentIndex + 1;
        }
        
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex === this.totalSlides - 1 ? '0.5' : '1';
            this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    handleKeyDown(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.next();
        }
    }
}

// 初始化所有画廊
document.addEventListener('DOMContentLoaded', () => {
    new ProjectGallery(1);
    new ProjectGallery(2);
    new ProjectGallery(3);
    new ProjectGallery(4);
    new ProjectGallery(5);
    
    const projectShowcases = document.querySelectorAll('.project-showcase');
    
    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    projectShowcases.forEach((showcase, index) => {
        showcase.style.opacity = '0';
        showcase.style.transform = 'translateY(30px)';
        showcase.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        showcaseObserver.observe(showcase);
    });
});

document.querySelectorAll('.gallery-container').forEach(container => {
    container.style.cursor = 'grab';
});

document.querySelectorAll('.gallery-slide img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});