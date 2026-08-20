document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Subtle parallax effect on mouse move for the hero illustration
    const heroIllustration = document.querySelector('.hero-illustration');
    const floatingNodes = document.querySelectorAll('.floating-node');

    if (heroIllustration && floatingNodes.length > 0) {
        heroIllustration.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = heroIllustration.getBoundingClientRect();
            
            // Calculate mouse position relative to the center of the illustration
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;

            // Apply transform to each node with slightly different multipliers for depth effect
            floatingNodes.forEach((node, index) => {
                const speed = (index % 3) + 1; // Different speeds for different layers
                const moveX = x * speed * 20;
                const moveY = y * speed * 20;
                
                // We use CSS custom properties or direct transform to override/combine with CSS animation
                // Since there is a CSS float animation, we wrap the node's icon in a span to transform that instead,
                // OR we just apply transform to the node itself (might conflict with CSS keyframes slightly, 
                // but for a simple demo this is fine).
                
                node.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        // Reset transform on mouse leave
        heroIllustration.addEventListener('mouseleave', () => {
            floatingNodes.forEach(node => {
                node.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // Animated Counter Logic with IntersectionObserver
    const counterElements = document.querySelectorAll('[data-counter]');

    if (counterElements.length > 0) {
        const animateCounter = (el) => {
            const target = parseFloat(el.getAttribute('data-counter'));
            const duration = parseInt(el.getAttribute('data-duration') || '2000', 10);
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const format = el.getAttribute('data-format') || ''; // 'k' for 9000 -> 9K
            
            let startTime = null;

            const updateCounter = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                
                // EaseOutExpo curve for smooth slowing down at the end
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentValue = easeProgress * target;

                let displayVal = currentValue.toFixed(decimals);

                if (format === 'k' && currentValue >= 1000) {
                    displayVal = (currentValue / 1000).toFixed(decimals) + 'K';
                } else if (format === 'm' && currentValue >= 1000000) {
                    displayVal = (currentValue / 1000000).toFixed(decimals) + 'M';
                }

                el.textContent = `${prefix}${displayVal}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Final display string
                    let finalVal = target.toFixed(decimals);
                    if (format === 'k' && target >= 1000) {
                        finalVal = (target / 1000).toFixed(decimals) + 'K';
                    } else if (format === 'm' && target >= 1000000) {
                        finalVal = (target / 1000000).toFixed(decimals) + 'M';
                    }
                    el.textContent = `${prefix}${finalVal}${suffix}`;
                }
            };

            requestAnimationFrame(updateCounter);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target); // Run animation once
                }
            });
        }, { threshold: 0.2 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    // Timeframe Filter Tabs Switcher for Technoleet In Numbers
    const timeTabBtns = document.querySelectorAll('.time-tab-btn');
    const statData = {
        'all': { stat1: 20, stat2: 10, stat3: 9000, stat4: 80 },
        '2026': { stat1: 8, stat2: 1, stat3: 3400, stat4: 42 },
        '12m': { stat1: 14, stat2: 1, stat3: 6200, stat4: 65 }
    };

    if (timeTabBtns.length > 0) {
        timeTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                timeTabBtns.forEach(b => b.classList.remove('active-time-tab', 'text-white'));
                timeTabBtns.forEach(b => b.classList.add('text-gray-500'));
                
                btn.classList.add('active-time-tab', 'text-white');
                btn.classList.remove('text-gray-500');

                const timeKey = btn.getAttribute('data-time');
                const targetValues = statData[timeKey] || statData['all'];

                const s1 = document.getElementById('stat-1-val');
                const s2 = document.getElementById('stat-2-val');
                const s3 = document.getElementById('stat-3-val');
                const s4 = document.getElementById('stat-4-val');

                if (s1) s1.setAttribute('data-counter', targetValues.stat1);
                if (s2) s2.setAttribute('data-counter', targetValues.stat2);
                if (s3) s3.setAttribute('data-counter', targetValues.stat3);
                if (s4) s4.setAttribute('data-counter', targetValues.stat4);

                // Trigger smooth re-animation
                [s1, s2, s3, s4].forEach(el => {
                    if (el) {
                        const target = parseFloat(el.getAttribute('data-counter'));
                        const format = el.getAttribute('data-format') || '';
                        const suffix = el.getAttribute('data-suffix') || '';
                        
                        if (format === 'k' && target >= 1000) {
                            el.textContent = (target / 1000).toFixed(0) + 'K' + suffix;
                        } else {
                            el.textContent = target + suffix;
                        }
                    }
                });
            });
        });
    }

    // ==========================================================================
    // Product Category Filter Switcher
    // ==========================================================================
    const filterTabs = document.querySelectorAll('.filter-tab-btn');
    const productCards = document.querySelectorAll('.product-card-item');

    if (filterTabs.length > 0 && productCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => {
                    t.classList.remove('active-filter', 'bg-blue-600', 'text-white');
                    t.classList.add('text-gray-500', 'bg-gray-100/80');
                });
                tab.classList.add('active-filter');
                tab.classList.remove('text-gray-500', 'bg-gray-100/80');

                const selectedCategory = tab.getAttribute('data-category');

                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================================================
    // Product Quick View Modal & Hero Demo Video Modal
    // ==========================================================================
    const productModalOverlay = document.getElementById('product-modal-overlay');
    const productModalClose = document.getElementById('product-modal-close');
    const modalCloseSecondary = document.getElementById('modal-close-secondary');
    const modalTitle = document.getElementById('modal-product-title');
    const modalBadge = document.getElementById('modal-product-badge');
    const modalDesc = document.getElementById('modal-product-desc');

    const openProductBtns = document.querySelectorAll('.open-product-modal');

    const openModal = (overlay) => {
        if (overlay) overlay.classList.add('active');
    };

    const closeModal = (overlay) => {
        if (overlay) overlay.classList.remove('active');
    };

    openProductBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = btn.getAttribute('data-title') || 'Platform Specification';
            const badge = btn.getAttribute('data-badge') || 'Enterprise';
            const desc = btn.getAttribute('data-desc') || 'High performance cloud ecosystem.';

            if (modalTitle) modalTitle.textContent = title;
            if (modalBadge) modalBadge.textContent = badge;
            if (modalDesc) modalDesc.textContent = desc;

            openModal(productModalOverlay);
        });
    });

    if (productModalClose) productModalClose.addEventListener('click', () => closeModal(productModalOverlay));
    if (modalCloseSecondary) modalCloseSecondary.addEventListener('click', () => closeModal(productModalOverlay));
    if (productModalOverlay) {
        productModalOverlay.addEventListener('click', (e) => {
            if (e.target === productModalOverlay) closeModal(productModalOverlay);
        });
    }

    // Hero Watch Demo Modal
    const heroDemoBtn = document.getElementById('hero-watch-demo');
    const demoModalOverlay = document.getElementById('demo-modal-overlay');
    const demoModalClose = document.getElementById('demo-modal-close');

    if (heroDemoBtn && demoModalOverlay) {
        heroDemoBtn.addEventListener('click', () => openModal(demoModalOverlay));
    }
    if (demoModalClose && demoModalOverlay) {
        demoModalClose.addEventListener('click', () => closeModal(demoModalOverlay));
    }
    if (demoModalOverlay) {
        demoModalOverlay.addEventListener('click', (e) => {
            if (e.target === demoModalOverlay) closeModal(demoModalOverlay);
        });
    }

    // Esc key close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(productModalOverlay);
            closeModal(demoModalOverlay);
        }
    });

    // ==========================================================================
    // Pricing Monthly/Annual Billing Switcher
    // ==========================================================================
    const pricingToggle = document.getElementById('pricing-toggle');
    const priceElements = document.querySelectorAll('.price-val');

    if (pricingToggle && priceElements.length > 0) {
        pricingToggle.addEventListener('change', () => {
            const isAnnual = pricingToggle.checked;
            priceElements.forEach(el => {
                const monthlyPrice = el.getAttribute('data-monthly');
                const annualPrice = el.getAttribute('data-annual');
                el.textContent = isAnnual ? annualPrice : monthlyPrice;
            });
        });
    }

    // ==========================================================================
    // Interactive ROI & Project Cost Estimator
    // ==========================================================================
    const moduleSlider = document.getElementById('module-slider');
    const moduleCountDisplay = document.getElementById('module-count-display');
    const addonApp = document.getElementById('addon-app');
    const addonAi = document.getElementById('addon-ai');
    const addonSla = document.getElementById('addon-sla');
    const calcTotalPrice = document.getElementById('calc-total-price');
    const calcDeliveryTime = document.getElementById('calc-delivery-time');

    const updateCalculator = () => {
        if (!moduleSlider || !calcTotalPrice) return;

        const modules = parseInt(moduleSlider.value, 10);
        if (moduleCountDisplay) moduleCountDisplay.textContent = `${modules} Module${modules > 1 ? 's' : ''}`;

        let baseCost = modules * 500;
        let addonsCost = 0;

        if (addonApp && addonApp.checked) addonsCost += 1000;
        if (addonAi && addonAi.checked) addonsCost += 800;
        if (addonSla && addonSla.checked) addonsCost += 500;

        const totalCost = baseCost + addonsCost;
        calcTotalPrice.textContent = `$${totalCost.toLocaleString()}`;

        let deliveryWeeks = Math.ceil(modules * 0.8) + (addonApp && addonApp.checked ? 1 : 0);
        if (calcDeliveryTime) calcDeliveryTime.textContent = `Estimated Delivery: ${deliveryWeeks}-${deliveryWeeks + 2} Weeks`;
    };

    if (moduleSlider) moduleSlider.addEventListener('input', updateCalculator);
    if (addonApp) addonApp.addEventListener('change', updateCalculator);
    if (addonAi) addonAi.addEventListener('change', updateCalculator);
    if (addonSla) addonSla.addEventListener('change', updateCalculator);

    // Initial run
    updateCalculator();

    // ==========================================================================
    // Searchable FAQ Accordion
    // ==========================================================================
    const faqSearchInput = document.getElementById('faq-search-input');
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const toggleBtn = item.querySelector('.faq-toggle');
            const answerDiv = item.querySelector('.faq-answer');
            const icon = item.querySelector('i[data-lucide="chevron-down"]');

            if (toggleBtn && answerDiv) {
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = !answerDiv.classList.contains('hidden');

                    // Close all other FAQs
                    faqItems.forEach(otherItem => {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('i[data-lucide="chevron-down"]');
                        if (otherAnswer) otherAnswer.classList.add('hidden');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    });

                    if (!isExpanded) {
                        answerDiv.classList.remove('hidden');
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    }
                });
            }
        });
    }

    if (faqSearchInput && faqItems.length > 0) {
        faqSearchInput.addEventListener('input', () => {
            const query = faqSearchInput.value.toLowerCase().trim();
            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // ==========================================================================
    // Contact Form & Toast Notifications
    // ==========================================================================
    const contactBudgetSlider = document.getElementById('contact-budget-slider');
    const contactBudgetVal = document.getElementById('contact-budget-val');
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    if (contactBudgetSlider && contactBudgetVal) {
        contactBudgetSlider.addEventListener('input', () => {
            const val = parseInt(contactBudgetSlider.value, 10);
            contactBudgetVal.textContent = `$${val.toLocaleString()}`;
        });
    }

    const showToast = (message) => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast-item';
        toast.innerHTML = `<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400"></i> ${message}`;
        toastContainer.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => toast.classList.add('toast-show'), 50);
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you! Your proposal request has been received. Our team will contact you within 2 hours.');
            contactForm.reset();
            if (contactBudgetVal) contactBudgetVal.textContent = '$10,000';
        });
    }

    // ==========================================================================
    // Back to Top Button & Active Scrollspy
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show-btn');
            } else {
                backToTopBtn.classList.remove('show-btn');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Submenu & Mega Menu Accordion Toggle
    const navItemsWithSubmenu = document.querySelectorAll('.nav-item');
    navItemsWithSubmenu.forEach(item => {
        const link = item.querySelector('.nav-link');
        const hasSubmenu = item.querySelector('.dropdown-menu') || item.querySelector('.megamenu');
        if (link && hasSubmenu) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    item.classList.toggle('mobile-expanded');
                }
            });
        }
    });
});



