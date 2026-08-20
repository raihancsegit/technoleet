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
});


