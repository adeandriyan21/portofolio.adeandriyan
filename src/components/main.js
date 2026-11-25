document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    const typingWords = [
        'Kuliah Teknik Informatika',
        'Frontend Web Developer',
        'Pengurus BEM STTIKOM IU',
        'Pendidikan',
        'Menjadi Lebih Baik',
        'Belajar ngoding'
    ];
    const typedEl = document.getElementById('typed-text');
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeStep() {
        if (!typedEl) return;
        const currentWord = typingWords[wordIdx];

        if (!isDeleting) {
            typedEl.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === currentWord.length) {
                isDeleting = true;
                setTimeout(typeStep, 1600);
                return;
            }
            setTimeout(typeStep, 75);
        } else {
            typedEl.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % typingWords.length;
                setTimeout(typeStep, 400);
                return;
            }
            setTimeout(typeStep, 35);
        }
    }
    typeStep();

    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const mouse = { x: -1000, y: -1000, radius: 120 };

        function resizeCanvas() {
            const hero = canvas.parentElement;
            width = canvas.width = (hero && hero.offsetWidth) || window.innerWidth || 800;
            height = canvas.height = (hero && hero.offsetHeight) || window.innerHeight || 600;

            const particleCount = Math.min(65, Math.floor((width * height) / 16000));
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.7,
                    vy: (Math.random() - 0.5) * 0.7,
                    radius: Math.random() * 2 + 1,
                    color: 'rgba(255, 87, 34, 0.45)'
                });
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const heroEl = canvas.parentElement;
        heroEl.addEventListener('pointermove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroEl.addEventListener('pointerleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x += (dx / dist) * force * 3;
                    p.y += (dy / dist) * force * 3;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist2 < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 145, 0, ${0.25 * (1 - dist2 / 110)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    const themeToggles = document.querySelectorAll('.theme-toggle-trigger');
    const themeIcons = document.querySelectorAll('.theme-toggle-icon');
    const themeTexts = document.querySelectorAll('.theme-toggle-text');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);

        themeIcons.forEach((icon) => {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
        themeTexts.forEach((text) => {
            text.textContent = theme === 'dark' ? 'Mode Terang' : 'Mode Gelap';
        });
    }

    const savedTheme = localStorage.getItem('portfolio-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggles.forEach((btn) => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
            showToast(current === 'dark' ? '☀️ Mode Terang Diaktifkan' : '🌙 Mode Gelap Diaktifkan');
        });
    });

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleSidebar(open) {
        const isOpen = open !== undefined ? open : !sidebar.classList.contains('open');
        sidebar.classList.toggle('open', isOpen);
        sidebarOverlay.classList.toggle('active', isOpen);
        if (hamburgerBtn) hamburgerBtn.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen && window.innerWidth <= 860 ? 'hidden' : '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => toggleSidebar());
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 860) {
                toggleSidebar(false);
            }
        });
    });

    const progressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = `${scrolled}%`;

        let currentId = '';
        const scrollPos = window.scrollY + 160;

        sections.forEach((sec) => {
            const top = sec.offsetTop;
            const h = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + h) {
                currentId = sec.getAttribute('id');
            }
        });

        if (currentId) {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
            });
        }
    }, { passive: true });

    const counterElements = document.querySelectorAll('.counter-val');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counterElements.forEach((el) => {
                    const target = +el.getAttribute('data-target') || 0;
                    let count = 0;
                    const duration = 1500;
                    const stepTime = 25;
                    const increment = target / (duration / stepTime);

                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            el.textContent = target + (el.dataset.suffix || '');
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(count) + (el.dataset.suffix || '');
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.1 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) counterObserver.observe(statsSection);

    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.getAttribute('data-level');
                bar.style.width = `${level}%`;
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.1 });

    skillBars.forEach((bar) => skillObserver.observe(bar));

    const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            skillFilterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.getAttribute('data-filter');
            skillCards.forEach((card) => {
                const match = cat === 'all' || card.getAttribute('data-category') === cat;
                card.style.display = match ? 'block' : 'none';
            });
        });
    });

    const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            projectFilterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectCards.forEach((card) => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                if (match) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const projectData = {
        'web-toko': {
            title: 'Website Toko Online (Web Toko)',
            category: 'E-Commerce / Tugas Web Design',
            desc: 'Proyek website e-commerce modern dengan halaman beranda interaktif, etalase katalog produk, detail spesifikasi produk, sistem keranjang belanja berbasis LocalStorage, dan formulir checkout langsung.',
            tech: ['HTML5', 'CSS3 Modern', 'JavaScript ES6', 'LocalStorage', 'Responsive Grid'],
            highlights: [
                'Katalog produk responsif dengan filter kategori dinamis',
                'Sistem penambahan ke keranjang & kalkulasi total harga otomatis',
                'Desain antarmuka yang ramah pengguna di perangkat smartphone & desktop'
            ]
        },
        'portfolio-interaktif': {
            title: 'Website Portofolio Interaktif Ade Andriyan',
            category: 'Web App / Personal Branding',
            desc: 'Website portofolio yang Anda lihat sekarang! Dibuat dengan clean HTML5, CSS kustom berperforma tinggi, animasi partikel interaktif, dark & light mode switchable, dan tata letak responsif.',
            tech: ['HTML5 Semantik', 'CSS Variables', 'Canvas 2D API', 'Vanilla JavaScript', 'Vite'],
            highlights: [
                'Dark mode otomatis dan tersimpan di memori browser (localStorage)',
                'Responsif sempurna di layar HP, tablet, maupun layar monitor besar',
                'Animasi canvas partikel interaktif yang merespons pergerakan kursor'
            ]
        },
        'jadwal-kuliah': {
            title: 'Aplikasi Manajemen Jadwal Kuliah & Tugas',
            category: 'Web App / Kuliah',
            desc: 'Aplikasi web ringkas untuk mahasiswa STTIKOM Insan Unggul dalam mencatat jadwal perkuliahan harian, daftar tugas (to-do list), status pengerjaan, dan pengingat deadline tanpa perlu koneksi internet.',
            tech: ['JavaScript DOM', 'CSS Flexbox', 'HTML5 Web Storage', 'Mobile First'],
            highlights: [
                'Penyimpanan lokal cepat tanpa delay koneksi jaringan',
                'Fitur checklist tugas selesai dan filter berdasarkan mata kuliah',
                'Ringan dan dapat dibuka langsung melalui browser ponsel'
            ]
        },
        'web-dasar': {
            title: 'Modul & Eksplorasi Web Dasar Semester 3',
            category: 'Desain Web / Modul Pembelajaran',
            desc: 'Kumpulan latihan dan modul praktikum mata kuliah Web Design Semester 3, mencakup manipulasi DOM JavaScript, formulir validasi, layout W3.CSS, dan responsive navigation bar.',
            tech: ['HTML5', 'CSS3', 'W3.CSS', 'JavaScript Dasar'],
            highlights: [
                'Implementasi validasi form langsung sebelum pengiriman data',
                'Eksplorasi komponen antarmuka W3.CSS yang terstruktur',
                'Dokumentasi kode rapi untuk kebutuhan evaluasi praktikum dosen'
            ]
        }
    };

    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('modal-project-title');
    const projectModalCategory = document.getElementById('modal-project-category');
    const projectModalDesc = document.getElementById('modal-project-desc');
    const projectModalTech = document.getElementById('modal-project-tech');
    const projectModalHighlights = document.getElementById('modal-project-highlights');

    document.querySelectorAll('.open-project-modal').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-project');
            const data = projectData[id];
            if (!data) return;

            if (projectModalTitle) projectModalTitle.textContent = data.title;
            if (projectModalCategory) projectModalCategory.textContent = data.category;
            if (projectModalDesc) projectModalDesc.textContent = data.desc;

            if (projectModalTech) {
                projectModalTech.innerHTML = data.tech
                    .map((t) => `<span class="tag-badge" style="background:var(--accent-subtle);color:var(--accent-primary);font-weight:700">${t}</span>`)
                    .join('');
            }

            if (projectModalHighlights) {
                projectModalHighlights.innerHTML = data.highlights
                    .map((h) => `<li style="margin-bottom:6px;display:flex;align-items:center;gap:8px;"><i class="fas fa-check-circle" style="color:#10b981"></i> <span>${h}</span></li>`)
                    .join('');
            }

            openModal(projectModal);
        });
    });

    const cvModal = document.getElementById('cv-modal');
    document.querySelectorAll('.open-cv-modal').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(cvModal);
        });
    });

    const printCvBtn = document.getElementById('print-cv-btn');
    if (printCvBtn) {
        printCvBtn.addEventListener('click', () => {
            window.print();
        });
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.modal-close-trigger').forEach((btn) => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-backdrop');
            closeModal(modal);
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal(backdrop);
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.active').forEach(closeModal);
            if (sidebar.classList.contains('open')) toggleSidebar(false);
        }
    });

    let toastTimer;
    function showToast(message) {
        let toast = document.getElementById('toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notice';
            toast.className = 'toast-notice';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
