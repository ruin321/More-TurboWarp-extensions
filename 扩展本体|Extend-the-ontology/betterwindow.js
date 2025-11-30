
(function (Scratch) {
    'use strict';

    const EXTENSION_ID = 'beautifulAlerts2025';
    const EXTENSION_NAME = '动效插件';
    const EXTENSION_DESCRIPTION = '带有高级动画效果的现代化提示选择窗口和通知 插件by Ruin321';

    let modalContainer = null;
    let notificationContainer = null;

    const Animations = {
        fadeIn(element, duration = 400) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(-30px) scale(0.9) rotateX(5deg)';
            
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutBack = 1 + (1.70158 + 1) * Math.pow(progress - 1, 3) + 1.70158 * Math.pow(progress - 1, 2);
                const easeOutElastic = progress === 1 ? 1 : 
                    Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
                
                const combinedEase = (easeOutBack + easeOutElastic) / 2;
                
                element.style.opacity = combinedEase;
                element.style.transform = `
                    translateY(${-30 + (30 * combinedEase)}px) 
                    scale(${0.9 + (0.1 * combinedEase)})
                    rotateX(${5 - (5 * combinedEase)}deg)
                `;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },

        fadeOut(element, duration = 300) {
            const startOpacity = parseFloat(element.style.opacity) || 1;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeInCubic = Math.pow(progress, 3);
                
                element.style.opacity = startOpacity * (1 - easeInCubic);
                element.style.transform = `
                    translateY(${30 * easeInCubic}px) 
                    scale(${1 - (0.1 * easeInCubic)})
                    rotateX(${5 * easeInCubic}deg)
                `;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        },


        flipInNotification(element, position, duration = 600) {
            const startTime = performance.now();
            let startX, startY, startRotate;
            
            switch(position) {
                case '左上角':
                    startX = -400;
                    startY = -100;
                    startRotate = -15;
                    break;
                case '右上角':
                    startX = 400;
                    startY = -100;
                    startRotate = 15;
                    break;
                case '左下角':
                    startX = -400;
                    startY = 100;
                    startRotate = -15;
                    break;
                case '右下角':
                    startX = 400;
                    startY = 100;
                    startRotate = 15;
                    break;
            }
            
            element.style.transform = `translate(${startX}px, ${startY}px) rotateY(${startRotate}deg)`;
            element.style.opacity = '0';
            element.style.filter = 'blur(10px)';
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                

                const easeOutElastic = progress === 1 ? 1 : 
                    Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
                
                const currentX = startX * (1 - easeOutElastic);
                const currentY = startY * (1 - easeOutElastic);
                const currentRotate = startRotate * (1 - easeOutElastic);
                
                element.style.transform = `translate(${currentX}px, ${currentY}px) rotateY(${currentRotate}deg)`;
                element.style.opacity = easeOutElastic.toString();
                element.style.filter = `blur(${10 * (1 - easeOutElastic)}px)`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },

        flipOutNotification(element, position, duration = 600) { 
            const startTime = performance.now();
            let targetX, targetY, targetRotate;
            
            switch(position) {
                case '左上角':
                    targetX = -400;
                    targetY = -100;
                    targetRotate = -15;
                    break;
                case '右上角':
                    targetX = 400;
                    targetY = -100;
                    targetRotate = 15;
                    break;
                case '左下角':
                    targetX = -400;
                    targetY = 100;
                    targetRotate = -15;
                    break;
                case '右下角':
                    targetX = 400;
                    targetY = 100;
                    targetRotate = 15;
                    break;
            }
            
            const startTransform = element.style.transform;
            const startOpacity = parseFloat(element.style.opacity) || 1;
            const startBlur = 0;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeIn = Math.pow(progress, 2); 
                const scale = 1 - (0.3 * progress); 
                
                const currentX = targetX * easeIn;
                const currentY = targetY * easeIn;
                const currentRotate = targetRotate * easeIn;
                const currentBlur = 20 * progress;
                
                element.style.transform = `translate(${currentX}px, ${currentY}px) rotateY(${currentRotate}deg) scale(${scale})`; 
                element.style.opacity = (startOpacity * (1 - easeIn)).toString();
                element.style.filter = `blur(${currentBlur}px)`; 
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        },


        createParticleExplosion(x, y, color) {
            const particles = [];
            const particleCount = 20; 
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const size = 4 + Math.random() * 8; 
                particle.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10002;
                    left: ${x}px;
                    top: ${y}px;
                    box-shadow: 0 0 10px ${color};
                `;
                
                document.body.appendChild(particle);
                particles.push({
                    element: particle,
                    angle: (i * 2 * Math.PI) / particleCount,
                    speed: 3 + Math.random() * 5, 
                    life: 1
                });
            }
            
            const startTime = performance.now();
            const duration = 1000; 
            
            const animateParticles = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                particles.forEach((particle, index) => {
                    if (particle.life <= 0) return;
                    
                    const distance = particle.speed * progress * 60; 
                    const currentX = x + Math.cos(particle.angle) * distance;
                    const currentY = y + Math.sin(particle.angle) * distance;
                    
                    particle.life = 1 - progress;
                    
                    particle.element.style.left = `${currentX}px`;
                    particle.element.style.top = `${currentY}px`;
                    particle.element.style.opacity = particle.life;
                    particle.element.style.transform = `scale(${0.3 + particle.life * 0.7})`; 
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animateParticles);
                } else {
                    particles.forEach(particle => {
                        if (particle.element.parentNode) {
                            particle.element.parentNode.removeChild(particle.element);
                        }
                    });
                }
            };
            
            requestAnimationFrame(animateParticles);
        },

        addShineEffect(element, color) {
            const shine = document.createElement('div');
            shine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, ${color}, transparent);
                transform: skewX(-20deg);
                transition: left 0s;
            `;
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(shine);
            
            element.addEventListener('mouseenter', () => {
                shine.style.transition = 'left 0.8s ease';
                shine.style.left = '100%';
                
                setTimeout(() => {
                    shine.style.transition = 'left 0s';
                    shine.style.left = '-100%';
                }, 800);
            });
        },

        addPulseEffect(element) {
            let pulseCount = 0;
            const maxPulses = 2;
            
            const pulse = () => {
                if (pulseCount >= maxPulses) return;
                
                pulseCount++;
                element.style.transform = 'scale(1.05)';
                element.style.boxShadow = '0 0 30px currentColor';
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.boxShadow = '';
                    
                    setTimeout(() => {
                        pulseCount--;
                    }, 200);
                }, 200);
            };
            
            setTimeout(pulse, 500);
            setInterval(pulse, 3000);
        },

        progressBarAnimation(progressBar, duration, color) {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                progressBar.style.background = `
                    linear-gradient(90deg, 
                        ${color} 0%, 
                        ${color}80 ${progress * 80}%, 
                        transparent ${progress * 100}%
                    )
                `;
                
                progressBar.style.width = `${100 - (progress * 100)}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },

        addMagneticEffect(button) {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                button.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        },

        buttonClick(element) {
            element.style.transform = 'scale(0.95)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100);
        },

        fadeOutOverlay(element, duration = 300) {
            const startOpacity = parseFloat(element.style.opacity) || 1;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeInCubic = Math.pow(progress, 3);
                
                element.style.opacity = startOpacity * (1 - easeInCubic);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    element.style.opacity = '1'; 
                }
            };
            
            requestAnimationFrame(animate);
        }
    };

    const createModalContainer = () => {
        if (modalContainer && document.body.contains(modalContainer)) {
            return modalContainer;
        }

        modalContainer = document.createElement('div');
        modalContainer.id = 'beautiful-modal-container';
        modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Segoe UI', system-ui, sans-serif;
            backdrop-filter: blur(10px) saturate(180%);
            opacity: 1;
            transition: opacity 0.3s ease; 
        `;

        const starfield = document.createElement('div');
        starfield.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
            pointer-events: none;
        `;
        modalContainer.appendChild(starfield);

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer || e.target === starfield) {
                destroyModal();
            }
        });

        document.body.appendChild(modalContainer);
        return modalContainer;
    };

    const createNotificationContainer = () => {
        if (notificationContainer && document.body.contains(notificationContainer)) {
            return notificationContainer;
        }

        notificationContainer = document.createElement('div');
        notificationContainer.id = 'beautiful-notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            z-index: 10001;
            pointer-events: none;
        `;

        document.body.appendChild(notificationContainer);
        return notificationContainer;
    };

    const destroyModal = () => {
        const modal = modalContainer?.querySelector('.beautiful-alert-modal');
        if (modal) {
            Animations.fadeOut(modal);
            setTimeout(() => {
                if (modal.parentNode) modal.parentNode.removeChild(modal);
                Animations.fadeOutOverlay(modalContainer); 
            }, 300);
        } else {
            if (modalContainer) {
                Animations.fadeOutOverlay(modalContainer);
            }
        }
    };

    const getStyleConfig = (style) => {
        const styles = {
            '信息': {
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                glow: '0 0 50px rgba(102, 126, 234, 0.4)',
                particle: '#667eea',
                pureColor: '#667eea',
                icon: '✨',
                bgPattern: 'rgba(102, 126, 234, 0.05)'
            },
            '成功': {
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                glow: '0 0 50px rgba(79, 172, 254, 0.4)',
                particle: '#4facfe',
                pureColor: '#4facfe',
                icon: '🎉',
                bgPattern: 'rgba(79, 172, 254, 0.05)'
            },
            '警告': {
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                glow: '0 0 50px rgba(245, 87, 108, 0.4)',
                particle: '#f5576c',
                pureColor: '#f5576c',
                icon: '⚡',
                bgPattern: 'rgba(245, 87, 108, 0.05)'
            },
            '错误': {
                gradient: 'linear-gradient(135deg, #ff5858 0%, #f09819 100%)',
                glow: '0 0 50px rgba(255, 88, 88, 0.4)',
                particle: '#ff5858',
                pureColor: '#ff5858',
                icon: '💥',
                bgPattern: 'rgba(255, 88, 88, 0.05)'
            },
            '疑问': {
                gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                glow: '0 0 50px rgba(168, 237, 234, 0.4)',
                particle: '#a8edea',
                pureColor: '#a8edea',
                icon: '🔮',
                bgPattern: 'rgba(168, 237, 234, 0.05)'
            }
        };
        return styles[style] || styles['信息'];
    };

    const showNotification = (message, style, position, duration) => {
        const container = createNotificationContainer();
        const config = getStyleConfig(style);
        
        container.style.position = 'fixed';
        container.style.zIndex = '10001';
        container.style.pointerEvents = 'none';
        switch(position) {
            case '左上角':
                container.style.top = '20px';
                container.style.left = '20px';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
                break;
            case '右上角':
                container.style.top = '20px';
                container.style.right = '20px';
                container.style.left = 'auto';
                container.style.bottom = 'auto';
                break;
            case '左下角':
                container.style.bottom = '20px';
                container.style.left = '20px';
                container.style.top = 'auto';
                container.style.right = 'auto';
                break;
            case '右下角':
                container.style.bottom = '20px';
                container.style.right = '20px';
                container.style.top = 'auto';
                container.style.left = 'auto';
                break;
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
            border-radius: 16px;
            padding: 20px 24px;
            margin: 12px 0;
            max-width: 380px;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.15), 
                ${config.glow},
                inset 0 1px 0 rgba(255,255,255,0.6);
            border: 1px solid rgba(255,255,255,0.3);
            display: flex;
            align-items: center;
            gap: 16px;
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
        `;

        const bgPattern = document.createElement('div');
        bgPattern.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 30% 20%, ${config.bgPattern} 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, ${config.bgPattern} 0%, transparent 50%);
            z-index: -1;
        `;
        notification.appendChild(bgPattern);
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            font-size: 24px;
            flex-shrink: 0;
            animation: float 3s ease-in-out infinite;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
        `;
        iconContainer.textContent = config.icon;
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            font-size: 14px;
            line-height: 1.5;
            color: #2d3748;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        `;
        content.textContent = message || '新通知';

        if (duration > 0) {
            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: rgba(0,0,0,0.1);
                border-radius: 0 0 16px 16px;
                overflow: hidden;
            `;

            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                height: 100%;
                width: 100%;
                border-radius: 0 0 16px 16px;
                transition: width 0.1s linear;
            `;
            
            progressContainer.appendChild(progressBar);
            notification.appendChild(progressContainer);

            Animations.progressBarAnimation(progressBar, duration, config.pureColor);
        }

        notification.appendChild(iconContainer);
        notification.appendChild(content);

        Animations.addShineEffect(notification, config.particle + '40');

        Animations.addPulseEffect(notification);

        container.appendChild(notification);

        notification.onmouseover = () => {
            notification.style.transform = 'translateY(-4px) scale(1.02)';
            notification.style.boxShadow = 
                `0 25px 50px rgba(0, 0, 0, 0.2), ${config.glow.replace('0.4', '0.6')}`;
        };
        notification.onmouseout = () => {
            notification.style.transform = 'translateY(0) scale(1)';
            notification.style.boxShadow = 
                `0 20px 40px rgba(0, 0, 0, 0.15), ${config.glow}`;
        };

        notification.onclick = (e) => {
            const rect = notification.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            Animations.createParticleExplosion(centerX, centerY, config.particle); // 改为中心位置
            Animations.flipOutNotification(notification, position);
        };

        Animations.flipInNotification(notification, position);

        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    const rect = notification.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    Animations.createParticleExplosion(centerX, centerY, config.particle);
                    Animations.flipOutNotification(notification, position);
                }
            }, duration);
        }
    };

    if (!document.getElementById('float-animation')) {
        const style = document.createElement('style');
        style.id = 'float-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-5px) rotate(2deg); }
            }
        `;
        document.head.appendChild(style);
    }

    const showAlert = (title, content, style) => {
        const container = createModalContainer();
        const config = getStyleConfig(style);

        const modal = document.createElement('div');
        modal.className = 'beautiful-alert-modal';
        modal.style.cssText = `
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
            border-radius: 24px;
            width: 90%;
            max-width: 480px;
            box-shadow: 
                0 30px 60px rgba(0, 0, 0, 0.25), 
                ${config.glow},
                inset 0 1px 0 rgba(255,255,255,0.6);
            border: 1px solid rgba(255,255,255,0.3);
            overflow: hidden;
            transform: translateY(-30px) scale(0.9) rotateX(5deg);
            opacity: 0;
            backdrop-filter: blur(20px);
            position: relative;
        `;

        const backgroundGlow = document.createElement('div');
        backgroundGlow.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: ${config.gradient};
            opacity: 0.1;
            z-index: -1;
            animation: rotate 20s linear infinite;
        `;
        modal.appendChild(backgroundGlow);
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 30px;
            background: ${config.gradient};
            color: white;
            display: flex;
            align-items: center;
            gap: 20px;
            position: relative;
            overflow: hidden;
        `;

        const headerParticles = document.createElement('div');
        headerParticles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%);
        `;
        header.appendChild(headerParticles);

        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 32px;
            z-index: 1;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
            animation: float 3s ease-in-out infinite;
        `;
        icon.textContent = config.icon;

        const titleElement = document.createElement('h3');
        titleElement.style.cssText = `
            margin: 0; 
            font-size: 22px; 
            font-weight: 700; 
            z-index: 1; 
            text-shadow: 0 2px 8px rgba(0,0,0,0.3);
            letter-spacing: 0.5px;
        `;
        titleElement.textContent = title || '提示';

        header.appendChild(icon);
        header.appendChild(titleElement);

        const body = document.createElement('div');
        body.style.cssText = `
            padding: 35px 30px;
            font-size: 16px;
            line-height: 1.7;
            color: #4a5568;
            background: rgba(248, 250, 252, 0.7);
            font-weight: 500;
        `;
        body.textContent = content || '无内容';

        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 25px 30px;
            background: rgba(255,255,255,0.5);
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid rgba(255,255,255,0.3);
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            padding: 14px 35px;
            border: none;
            border-radius: 50px;
            background: ${config.gradient};
            color: white;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        `;
        Animations.addMagneticEffect(closeBtn);
        Animations.addShineEffect(closeBtn, '#ffffff40');

        closeBtn.onmouseover = () => {
            closeBtn.style.transform = 'translateY(-3px)';
            closeBtn.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.25)';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.transform = 'translateY(0)';
            closeBtn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        };
        
        closeBtn.onclick = (e) => {
            const rect = closeBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            Animations.createParticleExplosion(centerX, centerY, config.particle);
            Animations.buttonClick(closeBtn);
            setTimeout(destroyModal, 200);
        };

        footer.appendChild(closeBtn);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        
        const oldModal = container.querySelector('.beautiful-alert-modal');
        if (oldModal) container.removeChild(oldModal);
        
        container.appendChild(modal);
        container.style.display = 'flex';

        if (!document.getElementById('rotate-animation')) {
            const style = document.createElement('style');
            style.id = 'rotate-animation';
            style.textContent = `
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        Animations.fadeIn(modal);
    };

    class BeautifulAlertExtension {
        getInfo() {
            return {
                id: EXTENSION_ID,
                name: EXTENSION_NAME,
                description: EXTENSION_DESCRIPTION,
                iconURL: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23667eea" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
                color1: '#667eea',
                color2: '#764ba2',
                blocks: [
                    {
                        opcode: 'showAlert',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '显示[STYLE]提示，标题：[TITLE]，内容：[CONTENT]',
                        arguments: {
                            STYLE: { 
                                type: Scratch.ArgumentType.STRING, 
                                menu: 'styleMenu', 
                                defaultValue: '信息' 
                            },
                            TITLE: { 
                                type: Scratch.ArgumentType.STRING, 
                                defaultValue: '请输入文本' 
                            },
                            CONTENT: { 
                                type: Scratch.ArgumentType.STRING, 
                                defaultValue: '请输入文本！' 
                            }
                        }
                    },
                    {
                        opcode: 'showNotification',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '在[POSITION]显示[STYLE]通知，内容：[MESSAGE]，持续时间：[DURATION]秒',
                        arguments: {
                            POSITION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'positionMenu',
                                defaultValue: '右上角'
                            },
                            STYLE: { 
                                type: Scratch.ArgumentType.STRING, 
                                menu: 'styleMenu', 
                                defaultValue: '信息' 
                            },
                            MESSAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '动效通知已开启！'
                            },
                            DURATION: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            }
                        }
                    }
                ],
                menus: {
                    styleMenu: {
                        acceptReporters: true,
                        items: ['信息', '成功', '警告', '错误', '疑问']
                    },
                    positionMenu: {
                        acceptReporters: true,
                        items: ['左上角', '右上角', '左下角', '右下角']
                    }
                }
            };
        }

        showAlert(args) {
            showAlert(args.TITLE, args.CONTENT, args.STYLE);
        }

        showNotification(args) {
            const duration = (args.DURATION || 5) * 1000;
            showNotification(args.MESSAGE, args.STYLE, args.POSITION, duration);
        }

    }

    if (typeof Scratch !== 'undefined' && Scratch.extensions) {
        Scratch.extensions.register(new BeautifulAlertExtension());
    }
})(Scratch || (typeof Scratch !== 'undefined' ? Scratch : window.Scratch));
