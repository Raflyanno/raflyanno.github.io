/**
 * RAFLY'S SPACE - Ultimate Interactive Script (V3)
 * Menangani: Global UI, Stories, Galleries, Film, dan Game
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // --- 2. MOBILE HAMBURGER MENU ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // --- 3. DYNAMIC TYPEWRITER EFFECT (Efek Mengetik) ---
    const typeTarget = document.querySelector('.typing-text');
    if (typeTarget) {
        const words = JSON.parse(typeTarget.getAttribute('data-words'));
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        function type() {
            const currentWord = words[wordIndex];
            typeTarget.textContent = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            let typeSpeed = isDeleting ? 40 : 80;
            if (!isDeleting && charIndex === currentWord.length) { typeSpeed = 1600; isDeleting = true; }
            else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 400; }
            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 800);
    }

    // --- 4. GLOBAL SCROLL REVEAL ANIMATION (Efek Muncul Halus) ---
    const revealElements = document.querySelectorAll('.nike-card, .story-card, .bento-grid .gallery-item, .vault-card, .stories-header, .vault-intro, .gallery-intro');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('element-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });

    revealElements.forEach(element => {
        element.classList.add('element-hidden');
        revealOnScroll.observe(element);
    });

    // --- 5. SPOTLIGHT LIGHTING EFFECT (Untuk Kartu Stories Nike) ---
    document.querySelectorAll('.nike-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // --- 6. READING PROGRESS BAR ---
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) progressBar.style.width = `${(window.scrollY / totalHeight) * 100}%`;
    });

    // --- 7. LIGHTBOX INTERAKTIF (Untuk Halaman Galleries) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    if (lightbox) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = item.querySelector('img').src;
                lightboxCaption.textContent = item.querySelector('.item-caption').textContent;
            });
        });
        lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) lightbox.style.display = 'none'; });
    }


    // ========================================================
    // KHUSUS: FITUR INTERAKTIF HALAMAN FILM & GAME
    // ========================================================

    // --- 8. CINEMATIC 3D POSTER TILT EFFECT ---
    const posters = document.querySelectorAll('.card-media');
    posters.forEach(poster => {
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posisi X kursor di dalam poster
            const y = e.clientY - rect.top;  // Posisi Y kursor di dalam poster
            
            const halfWidth = rect.width / 2;
            const halfHeight = rect.height / 2;
            
            // Hitung derajat kemiringan (Maksimal miring 10 derajat agar elegan)
            const rotateX = ((halfHeight - y) / halfHeight) * 10;
            const rotateY = ((x - halfWidth) / halfWidth) * 10;
            
            // Terapkan transformasi 3D ke poster
            poster.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        // Kembalikan poster ke posisi semula saat kursor keluar
        poster.addEventListener('mouseleave', () => {
            poster.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    // --- 9. STAGGERED SMOOTH FILTER TRANSITION ---
    // Mendeteksi perubahan tombol tab pill di halaman Film dan Game
    const vaultFilters = document.querySelectorAll('input[name="vault-filter"]');
    if (vaultFilters.length > 0) {
        vaultFilters.forEach(radio => {
            radio.addEventListener('change', () => {
                const cards = document.querySelectorAll('.vault-card');
                
                cards.forEach((card, index) => {
                    // Hilangkan kelas visible sejenak agar memicu animasi ulang
                    card.classList.remove('element-visible');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    
                    // Efek stagger: memunculkan kembali kartu satu per satu dengan jeda milidetik
                    setTimeout(() => {
                        // Cek apakah kartu tersebut lolos filter CSS (tidak di-display none)
                        if (card.offsetTop !== 0 || card.offsetLeft !== 0) {
                            card.classList.add('element-visible');
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }
                    }, index * 40); // Jeda 40ms antar kartu untuk efek mengalir mewah
                });
            });
        });
    }

});

// --- 10. AUTOMATIC REVIEW SYNC TO STORIES PAGE ---
    const autoContainer = document.getElementById('auto-reviews-container');
    
    if (autoContainer) {
        // Daftar halaman yang akan diintip oleh JavaScript
        const sourcePages = [
            { url: 'film.html', tag: 'Film Review' },
            { url: 'game.html', tag: 'Game Review' }
        ];

        sourcePages.forEach(source => {
            // Mengambil data file HTML lain secara background
            fetch(source.url)
                .then(response => response.text())
                .then(html => {
                    // Mengubah teks HTML menjadi objek DOM yang bisa dibaca JS
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const cards = doc.querySelectorAll('.vault-card');

                    cards.forEach(card => {
                        const actionBtn = card.querySelector('.card-action-btn');
                        
                        // Validasi: Hanya ambil kartu yang tombolnya TIDAK memiliki kelas 'disabled'
                        if (actionBtn && !actionBtn.classList.contains('disabled')) {
                            const title = card.querySelector('.card-item-title').textContent;
                            const imgUrl = card.querySelector('.card-media img').src;
                            const reviewLink = actionBtn.getAttribute('href');

                            // Bungkus data menjadi format kartu Nike Grid yang mewah
                            const nikeCardHTML = `
                                <article class="nike-card element-hidden">
                                    <div class="card-bg" style="background-image: url('${imgUrl}');"></div>
                                    <div class="card-overlay"></div>
                                    <div class="card-content">
                                        <p class="card-tag">${source.tag}</p>
                                        <h2 class="card-title">${title}</h2>
                                        <a href="${reviewLink}" class="nike-shop-btn">View Review</a>
                                    </div>
                                </article>
                            `;

                            // Suntikkan kartu ke dalam halaman stories
                            autoContainer.insertAdjacentHTML('beforeend', nikeCardHTML);
                        }
                    });

                    // Jalankan ulang fungsi interaksi (Senter & Scroll Reveal) untuk kartu baru
                    rebindDynamicEffects();
                });
        });
    }

    // Fungsi pembantu agar kartu baru hasil suntikan tetap mendapatkan efek animasi JS
    function rebindDynamicEffects() {
        document.querySelectorAll('.nike-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
            
            // Picu efek muncul halus
            setTimeout(() => { card.classList.add('element-visible'); }, 100);
        });
    }