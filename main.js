function initApp() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.getElementById('mainHeader');

    if (header) {
        // Add scroll event listener for floating header effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Debug: Log to verify it's working
        console.log('Header scroll effect initialized');
    } else {
        console.warn('Header element not found');
    }

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // ========================================
    // Smooth Scroll for Navigation
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target && header) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Intersection Observer for Scroll Reveal
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .problem-card, .process-step, .benefit-card, .why-card, .product-card, .team-card, .partner-card, .faq-item').forEach(el => {
        revealObserver.observe(el);
    });

    // ========================================
    // Process Flow Auto-Cycle
    // ========================================
    const processSteps = document.querySelectorAll('.process-step');
    let activeProcessStep = 0;

    function cycleProcessSteps() {
        processSteps.forEach((step, index) => {
            step.classList.remove('active');
        });
        if (processSteps.length > 0) {
            processSteps[activeProcessStep].classList.add('active');
            activeProcessStep = (activeProcessStep + 1) % processSteps.length;
        }
    }

    // Start cycling when process section is visible
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cycleProcessSteps();
                setInterval(cycleProcessSteps, 2000);
                processObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const processFlow = document.querySelector('.process-flow');
    if (processFlow) {
        processObserver.observe(processFlow);
    }

    // ========================================
    // FAQ Accordion
    // ========================================
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ========================================
    // Counter Animation for Metrics
    // ========================================
    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        // Extract suffix from initial content (like "10+", "90%", "3,800+")
        // Priority: data-suffix attribute > extracted from initial text
        let suffix = '';
        if (element.dataset.suffix !== undefined) {
            suffix = element.dataset.suffix;
        } else {
            const initialText = element.textContent.trim();
            // Remove all digits, commas, dots, and spaces to get the suffix
            suffix = initialText.replace(/[\d,.\s]+/g, '');
        }

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }

            // Format the number
            let formattedNumber = Math.floor(current);
            if (target >= 1000) {
                formattedNumber = formattedNumber.toLocaleString();
            }

            element.textContent = formattedNumber + suffix;
        }, 16);
    }

    // Observe metrics row
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.metric-value').forEach(el => {
                    const target = parseInt(el.dataset.target);
                    if (target) {
                        animateCounter(el, target);
                    }
                });
                metricsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const metricsRow = document.querySelector('.metrics-row');
    if (metricsRow) {
        metricsObserver.observe(metricsRow);
    }

    // ========================================
    // Add loading animation
    // ========================================
    document.body.classList.add('loaded');
}