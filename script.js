        const CursorEffect = (() => {
            const cursor = document.querySelector('.cursor-dot');

            const init = () => {
                if (!cursor) return;

                // Pindahkan cursor mengikuti mouse
                document.addEventListener('mousemove', (e) => {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                });

                // Efek Hover Membesar
                // PENTING: Kita harus tetap menyertakan 'translate(-50%, -50%)'
                // supaya cursor tidak loncat ke samping saat membesar.
                document.querySelectorAll('a, button, .project-card').forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
                        cursor.style.backgroundColor = 'white'; // Ganti warna saat hover (opsional)
                        cursor.style.mixBlendMode = 'difference'; // Efek keren (opsional)
                    });

                    el.addEventListener('mouseleave', () => {
                        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                        cursor.style.backgroundColor = '#667eea'; // Balik ke warna ungu
                        cursor.style.mixBlendMode = 'normal';
                    });
                });
            };

            return { init };
        })();

        // ==========================================
        // MOBILE MENU TOGGLE
        // ==========================================
        const MobileMenu = (() => {
            const toggle = document.getElementById('mobile-toggle');
            const menu = document.getElementById('mobile-menu');

            const init = () => {
                if (!toggle || !menu) return;

                toggle.addEventListener('click', () => {
                    menu.classList.toggle('hidden');
                });

                menu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        menu.classList.add('hidden');
                    });
                });
            };

            return { init };
        })();

        // ==========================================
        // SCROLL ANIMATIONS
        // ==========================================
        const ScrollAnimations = (() => {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            const init = () => {
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach(card => observer.observe(card));
            };

            return { init };
        })();

        // ==========================================
        // NAVBAR BACKGROUND ON SCROLL
        // ==========================================
        const NavbarScroll = (() => {
            const navbar = document.querySelector('nav');

            const init = () => {
                if (!navbar) return;

                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                    } else {
                        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
                    }
                });
            };

            return { init };
        })();

        // ==========================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ==========================================
        const SmoothScroll = (() => {
            const init = () => {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const target = document.querySelector(this.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });
            };

            return { init };
        })();

        // ==========================================
        // PROJECT CAROUSEL (INFINITE LOOP)
        // ==========================================
        const ProjectCarousel = (() => {
            let currentIndex = 0;
            let slidesToShow = 3;
            let isTransitioning = false;

            const track = document.querySelector('.carousel-track');
            const slides = document.querySelectorAll('.carousel-slide');
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            const dotsContainer = document.querySelector('.carousel-dots');

            const updateSlidesToShow = () => {
                if (window.innerWidth < 640) {
                    slidesToShow = 1;
                } else if (window.innerWidth < 1024) {
                    slidesToShow = 2;
                } else {
                    slidesToShow = 3;
                }
            };

            const cloneSlides = () => {
                // Clone slides untuk infinite effect
                const firstClones = [];
                const lastClones = [];

                for (let i = 0; i < slidesToShow; i++) {
                    const firstClone = slides[i].cloneNode(true);
                    const lastClone = slides[slides.length - 1 - i].cloneNode(true);

                    firstClone.classList.add('clone');
                    lastClone.classList.add('clone');

                    firstClones.push(firstClone);
                    lastClones.unshift(lastClone);
                }

                lastClones.forEach(clone => track.insertBefore(clone, track.firstChild));
                firstClones.forEach(clone => track.appendChild(clone));

                currentIndex = slidesToShow;
            };

            const updateCarousel = (smooth = true) => {
                const slideWidth = track.children[0].offsetWidth;
                const gap = 32;
                const offset = -(currentIndex * (slideWidth + gap));

                if (smooth) {
                    track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                } else {
                    track.style.transition = 'none';
                }

                track.style.transform = `translateX(${offset}px)`;

                // Update dots
                const realIndex = ((currentIndex - slidesToShow) % slides.length + slides.length) % slides.length;
                document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === realIndex);
                });
            };

            const handleTransitionEnd = () => {
                const totalSlides = track.children.length;

                if (currentIndex >= totalSlides - slidesToShow) {
                    currentIndex = slidesToShow;
                    updateCarousel(false);
                } else if (currentIndex < slidesToShow) {
                    currentIndex = totalSlides - slidesToShow * 2;
                    updateCarousel(false);
                }

                isTransitioning = false;
            };

            const createDots = () => {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < slides.length; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('carousel-dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        if (isTransitioning) return;
                        isTransitioning = true;
                        currentIndex = i + slidesToShow;
                        updateCarousel();
                    });
                    dotsContainer.appendChild(dot);
                }
            };

            const init = () => {
                if (!track || !slides.length) return;

                updateSlidesToShow();
                cloneSlides();
                createDots();
                updateCarousel(false);

                track.addEventListener('transitionend', handleTransitionEnd);

                prevBtn.addEventListener('click', () => {
                    if (isTransitioning) return;
                    isTransitioning = true;
                    currentIndex--;
                    updateCarousel();
                });

                nextBtn.addEventListener('click', () => {
                    if (isTransitioning) return;
                    isTransitioning = true;
                    currentIndex++;
                    updateCarousel();
                });

                window.addEventListener('resize', () => {
                    const oldSlidesToShow = slidesToShow;
                    updateSlidesToShow();

                    if (oldSlidesToShow !== slidesToShow) {
                        // Reset carousel on breakpoint change
                        track.innerHTML = '';
                        slides.forEach(slide => {
                            if (!slide.classList.contains('clone')) {
                                track.appendChild(slide.cloneNode(true));
                            }
                        });
                        location.reload(); // Simple reload untuk avoid bug
                    }
                });
            };

            return { init };
        })();

        // ==========================================
        // INITIALIZE ALL
        // ==========================================
        document.addEventListener('DOMContentLoaded', () => {
            CursorEffect.init();
            MobileMenu.init();
            ScrollAnimations.init();
            NavbarScroll.init();
            SmoothScroll.init();
            ProjectCarousel.init(); // Tambahkan ini
        });
