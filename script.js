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
            
            // Gap berbeda untuk mobile vs desktop
            const gap = window.innerWidth <= 640 ? 16 : 32; // 1rem (16px) untuk mobile, 2rem (32px) untuk desktop
            
            const offset = -(currentIndex * (slideWidth + gap));
            
            if (smooth) {
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(${offset}px)`;
            
            // Update scale & opacity untuk card (desktop only)
            if (window.innerWidth >= 1024) {
                const allSlides = track.querySelectorAll('.carousel-slide');
                allSlides.forEach((slide, index) => {
                    // Card yang aktif (3 card tengah)
                    if (index >= currentIndex && index < currentIndex + slidesToShow) {
                        slide.style.transform = 'scale(1)';
                        slide.style.opacity = '1';
                    } else {
                        slide.style.transform = 'scale(0.85)';
                        slide.style.opacity = '0.5';
                    }
                });
            } else {
                // Mobile/Tablet: semua card scale normal
                const allSlides = track.querySelectorAll('.carousel-slide');
                allSlides.forEach((slide) => {
                    slide.style.transform = 'scale(1)';
                    slide.style.opacity = '1';
                });
            }
            
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

            setTimeout(() => {
                updateCarousel(false);
            }, 50);

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
// PROJECT MODAL
// ==========================================
const ProjectModal = (() => {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalHeader = document.getElementById('modalHeader');
    const modalTitle = document.getElementById('modalTitle');
    const modalYear = document.getElementById('modalYear');
    const modalDescription = document.getElementById('modalDescription');
    const modalTech = document.getElementById('modalTech');
    const modalButtons = document.getElementById('modalButtons');
    
    // Data untuk setiap project
    const projectsData = {
        '1': {
            title: 'Birthday Card',
            year: '2024',
            gradient: 'from-blue-600 to-purple-700',
            image: 'images/birthday.png', 
            description: 'A simple birthday card made with HTML, CSS, and JavaScript. The card tilts when hovered, and when clicked, it opens up to reveal a birthday message. It also plays a song and shows confetti, adding a fun and celebratory touch to the experience.',
            tech: ['HTML', 'CSS', 'JavaScript'],
            liveLink: 'https://kokoparel.github.io/LiliBirthday/', // Ganti dengan link asli
            githubLink: 'https://github.com/Kokoparel/LiliBirthday', // Ganti dengan link asli
            isLive: true // Set true kalau sudah live
        },
        '2': {
            title: 'Berger Melet',
            year: '2025',
            gradient: 'from-green-600 to-teal-700',
            image: 'images/berger.png', 
            description: 'Saya mulai mempelajari Blender sebagai bagian dari eksplorasi saya dalam pengembangan game, dengan fokus pada dasar-dasar pemodelan 3D dan pembuatan aset. Dalam proses ini, saya membuat model 3D sederhana, termasuk model burger, serta berlatih membentuk, memberi tekstur, dan menyusun objek agar terlihat selaras. Proyek ini mencerminkan minat saya yang terus berkembang di bidang game development dan upaya saya untuk mengembangkan kemampuan visual dan kreatif sebagai pendukung pemrograman.',
            tech: ['Blender'],
            liveLink: '#',
            githubLink: '#',
            isLive: false
        },
        '3': {
            title: 'Fredihorhorhor',
            year: '2025',
            gradient: 'from-orange-600 to-red-700',
            image: 'images/fredi.png', 
            description: 'Saya mengembangkan Fredihorhorhor, sebuah game platformer 2D sederhana menggunakan Godot Engine sebagai bagian dari eksplorasi awal saya dalam pengembangan game. Game ini memiliki mekanik dasar seperti pergerakan horizontal, lompat, gravitasi, dan deteksi tabrakan, yang memungkinkan karakter berinteraksi dengan platform dengan baik. Pemain maju dengan menjelajahi platform dan mengumpulkan koin. Melalui proyek ini, saya mempelajari dasar pergerakan berbasis fisika, penanganan collision, serta mekanik inti game platformer.',
            tech: ['Godot'],
            liveLink: 'https://drive.google.com/drive/folders/1oaPwf6aGRM7NybODv1-I51w9bMy-hnsW?usp=drive_link',
            buttonText: 'Download Disini', 
            githubLink: '#',
            isLive: true
        },
        '4': {
            title: 'Techporia 2024',
            year: '2024',
            gradient: 'from-pink-600 to-purple-700',
            image: 'images/techpo.png', 
            description: 'Saya berkesempatan menjadi bagian dari tim pengembang website Techphoria, dengan fokus pada pembuatan halaman kompetisi. Techphoria merupakan acara IT tahunan yang menyelenggarakan berbagai kompetisi untuk mahasiswa universitas dan politeknik di seluruh Indonesia. Website ini berfungsi sebagai pusat informasi acara, pendaftaran, serta pembaruan terkait kegiatan Techphoria.',
            tech: ['PHP', 'CodeIgniter 4', 'CSS', 'JavaScript', 'MySQL'],
            liveLink: '#',
            githubLink: 'https://github.com/adaalif/Techporia-main-2024',
            isLive: false
        },
        '5': {
            title: 'Sinergi Fest 2025',
            year: '2025',
            gradient: 'from-pink-600 to-purple-700',
            image: 'images/sinergi.png', 
            description: 'Saya berkesempatan menjadi Project Manager dalam pengembangan website Sinergi Fest 2025, sekaligus berkontribusi langsung dalam pembuatan halaman kompetisi. Sinergi Fest 2025 merupakan acara IT tahunan yang menyelenggarakan berbagai kompetisi untuk mahasiswa universitas dan politeknik di seluruh Indonesia. Website ini berfungsi sebagai platform utama untuk informasi acara, pendaftaran, dan pembaruan. Melalui proyek ini, saya memimpin proses pengembangan sekaligus memperkuat kemampuan front-end, melanjutkan pengalaman saya dari pengembangan website Techphoria 2024.',
            tech: ['PHP', 'CodeIgniter 4', 'CSS', 'JavaScript', 'MySQL'],
            liveLink: '#',
            githubLink: 'https://github.com/Kokoparel/techpo-main-25',
            isLive: false
        }
    };
    
    const openModal = (projectId) => {
        const project = projectsData[projectId];
        if (!project) return;
        
        // Update header background
        modalHeader.className = `modal-header bg-gradient-to-br ${project.gradient} relative overflow-hidden`;
        modalHeader.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="absolute inset-0 w-full h-full object-cover">
        <button class="modal-close" id="modalCloseBtn">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
        `;
        
        // Update content
        modalTitle.textContent = project.title;
        modalYear.textContent = project.year;
        modalDescription.textContent = project.description;
        
        // Update tech badges
        modalTech.innerHTML = project.tech.map(tech => 
            `<span class="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">${tech}</span>`
        ).join('');
        
        // Update buttons
        const liveBtn = project.isLive 
            ? `<a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                ${project.buttonText || 'Visit Live Site'}
            </a>`
            : `<button class="modal-btn modal-btn-primary" disabled>
                Coming Soon
            </button>`;
               
        const githubBtn = project.githubLink !== '#'
            ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-secondary">
                   <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                   </svg>
                   View on GitHub
               </a>`
            : '';
        
        modalButtons.innerHTML = liveBtn + githubBtn;
        
        // Reattach close button event
        document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    const init = () => {
        // Close modal when clicking overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Close with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Add click events to all project cards
        document.querySelectorAll('[data-project]').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                openModal(projectId);
            });
        });
    };
    
    return { init, openModal, closeModal };
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
            ProjectCarousel.init();
            ProjectModal.init(); // Tambahkan ini
        });
