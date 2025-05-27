document.addEventListener('DOMContentLoaded', () => {
    // Floating menu functionality
    const floatingMenu = document.getElementById('floatingMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    const heroSection = document.querySelector('.hero');
    const watchButton = document.querySelector('.watch-button');
    
    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > heroBottom) {
            floatingMenu.classList.add('visible');
        } else {
            floatingMenu.classList.remove('visible');
            floatingMenu.classList.remove('active');
        }
    });

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!floatingMenu.contains(e.target)) {
            floatingMenu.classList.remove('active');
        }
    });

    // Hybrid smooth scroll: native if supported, fallback otherwise
    function supportsNativeSmoothScroll() {
        return 'scrollBehavior' in document.documentElement.style;
    }
    function smoothScrollToElement(element, duration = 900) {
        if (supportsNativeSmoothScroll()) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Custom fallback
            const targetY = element.getBoundingClientRect().top + window.pageYOffset;
            const startY = window.pageYOffset;
            const distance = targetY - startY;
            let startTime = null;
            function easeInOutSine(t) {
                return -(Math.cos(Math.PI * t) - 1) / 2;
            }
            function scrollStep(currentTime) {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                window.scrollTo(0, startY + distance * easeInOutSine(progress));
                if (progress < 1) {
                    requestAnimationFrame(scrollStep);
                }
            }
            requestAnimationFrame(scrollStep);
        }
    }

    // Scroll down arrow logic
    const scrollDownArrow = document.getElementById('scrollDownArrow');
    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', (e) => {
            e.preventDefault();
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                // Custom fallback and polyfill code removed for native support
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Custom fallback and polyfill code removed for native support
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Fade effects on scroll
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', () => {
        // Get scroll position
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Logo fades out faster (over first 10% of viewport height)
        const logoOpacity = Math.max(0, 1 - (scrollPosition / (windowHeight * 0.1)));
        logo.style.opacity = logoOpacity;
        
        // Navigation fades out more slowly (over first 25% of viewport height)
        const navOpacity = Math.max(0, 1 - (scrollPosition / (windowHeight * 0.25)));
        nav.style.opacity = navOpacity;
        
        // Disable pointer events when fully transparent
        logo.style.pointerEvents = logoOpacity === 0 ? 'none' : 'auto';
        nav.style.pointerEvents = navOpacity === 0 ? 'none' : 'auto';
    });

    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollPosition = window.scrollY;
            
            // Calculate opacity based on scroll position
            if (scrollPosition > heroBottom) {
                const fadeInStart = heroBottom;
                const fadeInEnd = heroBottom + 100; // Fade in over 100px of scrolling
                const opacity = Math.min(1, (scrollPosition - fadeInStart) / (fadeInEnd - fadeInStart));
                
                if (opacity > 0) {
                    backToTopButton.classList.add('visible');
                    backToTopButton.style.opacity = opacity;
                }
            } else {
                backToTopButton.classList.remove('visible');
                backToTopButton.style.opacity = 0;
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Services Slider Logic ---
    const slides = document.querySelectorAll('.services-slider .slide');
    const dots = document.querySelectorAll('.services-slider .dot');
    const mainArrow = document.querySelector('.services-slider .main-arrow');
    const mainArrowLeft = document.querySelector('.services-slider .main-arrow-left');
    const slidesTrack = document.querySelector('.slides-track');
    let currentSlide = 0;

    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        slidesTrack.style.transform = `translateX(-${index * 100}%)`;
        currentSlide = index;
        // Show/hide arrows using visibility and opacity instead of display
        if (mainArrowLeft) {
            if (currentSlide > 0) {
                mainArrowLeft.style.visibility = 'visible';
                mainArrowLeft.style.opacity = '1';
                mainArrowLeft.style.pointerEvents = 'auto';
            } else {
                mainArrowLeft.style.visibility = 'hidden';
                mainArrowLeft.style.opacity = '0';
                mainArrowLeft.style.pointerEvents = 'none';
            }
        }
        if (mainArrow) {
            if (currentSlide < slides.length - 1) {
                mainArrow.style.visibility = 'visible';
                mainArrow.style.opacity = '1';
                mainArrow.style.pointerEvents = 'auto';
            } else {
                mainArrow.style.visibility = 'hidden';
                mainArrow.style.opacity = '0';
                mainArrow.style.pointerEvents = 'none';
            }
        }
    }

    if (mainArrowLeft) {
        mainArrowLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            let prevIndex = (currentSlide - 1);
            showSlide(prevIndex);
        });
    }

    if (mainArrow) {
        mainArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIndex = (currentSlide + 1);
            showSlide(nextIndex);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
        });
    });

    // Initialize
    showSlide(0);

    // --- Video Modal Logic ---
    const videoModal = document.getElementById('videoModal');
    const videoModalIframe = document.getElementById('videoModalIframe');
    const videoModalClose = document.querySelector('.video-modal-close');
    const videoModalOverlay = document.querySelector('.video-modal-overlay');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const videoModalDesc = document.getElementById('videoModalDesc');
    const servicesWorksLinks = document.querySelectorAll('.services-slider .workslink');

    // Services data for each slide
    const servicesData = [
        {
            video: 'https://www.youtube.com/embed/EiIfQEln92Y',
            title: 'COMMERCIALS',
            desc: 'We produce cinematic, commercial-style videos that spotlight your product or brand through a compelling, story-driven narrative.'
        },
        {
            video: 'https://www.youtube.com/embed/Zl7Kq8K2JlQ',
            title: 'INDIVIDUALS',
            desc: 'We work with individuals who have powerful stories or missions, bringing their vision to life through cinematic content that sparks high impact connection.'
        },
        {
            video: 'https://www.youtube.com/embed/AfJ31ONMrfw',
            title: 'BUSINESSES',
            desc: 'We help businesses create consistent, high-quality video content that strengthens brand identity and deepens connections with their customers.'
        }
    ];

    servicesWorksLinks.forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            videoModal.classList.add('active');
            videoModalIframe.src = servicesData[i].video + '?autoplay=1';
            videoModalTitle.textContent = servicesData[i].title;
            videoModalDesc.textContent = servicesData[i].desc;
        });
    });

    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoModalIframe.src = '';
    }

    videoModalClose.addEventListener('click', closeVideoModal);
    videoModalOverlay.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // Home link logic: scroll to top and restart video
    const homeLink = document.querySelector('.floating-nav .home-link');
    const backgroundVideo = document.getElementById('background-video');
    if (homeLink && backgroundVideo) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Restart the video
            backgroundVideo.currentTime = 0;
            backgroundVideo.play();
        });
    }

    // --- Works Video Modal Logic ---
    const worksVideoModal = document.getElementById('worksVideoModal');
    const worksVideoModalIframe = document.getElementById('worksVideoModalIframe');
    const worksVideoModalClose = document.querySelector('.works-video-modal-close');
    const worksVideoModalOverlay = document.querySelector('.works-video-modal-overlay');
    const worksVideoModalTitle = document.getElementById('worksVideoModalTitle');
    const worksVideoModalDesc = document.getElementById('worksVideoModalDesc');
    const workRows = document.querySelectorAll('.work-row');

    // Example data for each work (replace with your actual data)
    const worksData = [
        {
            video: 'https://www.youtube.com/embed/TBEMKstYATw',
            title: 'GAME6',
            desc: 'Basketball facility / program located in Toronto.',
            detailedDesc: 'The commercial campaign for Game6 Sports Academy in Toronto aimed to elevate their message and brand through slick storytelling.'
        },
        {
            video: 'https://youtube.com/embed/RUUE3AyjSdU',
            title: 'TEJA SINGH',
            desc: 'Basketball star for Hamilton College.',
            detailedDesc: 'Yearly mixtapes for the D3 Sikh star have generated over a million views online. In highlighting his identity as well as his flashy basketball skillset, online audiences have been captivated by Singh.'
        },
        {
            video: 'https://www.youtube.com/embed/AfJ31ONMrfw',
            title: 'BADEN',
            desc: 'Sports equipment company.',
            detailedDesc: 'The "Make a Name" commercial campaign for Baden featured their customizable Baden basketball. The video included now nba All-Star, Paolo Banchero, along with others.'
        },
        {
            video: 'https://www.youtube.com/embed/Zl7Kq8K2JlQ',
            title: 'HARJIT SAJJAN',
            desc: 'Former Canadian Minister of National Defence, Canadian armed forces, and Vancouver Police.',
            detailedDesc: 'Work with former Canadian member of parliament Harjit Sajjan has highlighted the sport he engages while getting a behind the scenes look at who he is. '
        },
        {
            video: 'https://www.youtube.com/embed/0PKjZfdOBN0',
            title: 'HAMILTON COLLEGE',
            desc: 'NCAA Division 3 College.',
            detailedDesc: 'Yearly videos for the Hamilton College Men\'s basketball team were made in an artistic and thematic way, featuring a retro aesthetic.'
        },
        {
            video: 'https://www.youtube.com/embed/A-LshdaDsBI',
            title: 'CARDINAL BOYS',
            desc: 'Documentary on the Seattle Academy Boys Basketball Season.',
            detailedDesc: 'The Cardinal Boys documentary followed the Seattle Academy boys basketball team during their 2021 season as they sought to compete for a state championship.'
        }
    ];

    workRows.forEach((row, i) => {
        row.addEventListener('click', () => {
            worksVideoModal.classList.add('active');
            worksVideoModalIframe.src = worksData[i].video + '?autoplay=1';
            worksVideoModalTitle.textContent = worksData[i].title;
            worksVideoModalDesc.textContent = worksData[i].detailedDesc;
        });
    });

    function closeWorksVideoModal() {
        worksVideoModal.classList.remove('active');
        worksVideoModalIframe.src = '';
    }

    worksVideoModalClose.addEventListener('click', closeWorksVideoModal);
    worksVideoModalOverlay.addEventListener('click', closeWorksVideoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && worksVideoModal.classList.contains('active')) {
            closeWorksVideoModal();
        }
    });

    // Arrow fade on scroll (like logo)
    const scrollArrow = document.getElementById('scrollDownArrow');
    
    if (scrollArrow && heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            // Fade out over first 10% of viewport height (same as logo)
            const arrowOpacity = Math.max(0, 1 - (scrollPosition / (windowHeight * 0.1)));
            scrollArrow.style.opacity = arrowOpacity;
            scrollArrow.style.pointerEvents = arrowOpacity === 0 ? 'none' : 'auto';
            
            // Apply same fade to watch button
            if (watchButton) {
                watchButton.style.opacity = arrowOpacity;
                watchButton.style.pointerEvents = arrowOpacity === 0 ? 'none' : 'auto';
            }
        });
    }

    // Sound button functionality
    const vimeoModal = document.getElementById('vimeoModal');
    const vimeoModalIframe = document.getElementById('vimeoModalIframe');
    const vimeoModalClose = document.querySelector('.vimeo-modal-close');
    const vimeoModalOverlay = document.querySelector('.vimeo-modal-overlay');

    if (watchButton) {
        watchButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            vimeoModal.classList.add('active');
            vimeoModalIframe.src = 'https://player.vimeo.com/video/1086599197?autoplay=1';
            return false;
        }, true);
    }

    function closeVimeoModal() {
        vimeoModal.classList.remove('active');
        vimeoModalIframe.src = '';
    }

    vimeoModalClose.addEventListener('click', closeVimeoModal);
    vimeoModalOverlay.addEventListener('click', closeVimeoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && vimeoModal.classList.contains('active')) {
            closeVimeoModal();
        }
    });
}); 