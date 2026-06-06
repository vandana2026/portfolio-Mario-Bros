// ===== AUDIO CONTEXT =====
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        function playCoinSound() {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(987, now);
            osc.frequency.setValueAtTime(1318, now + 0.08);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        }

        function playBumpSound() {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        }

        function playStartSound() {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554, now + 0.1);
            osc.frequency.setValueAtTime(659, now + 0.2);
            osc.frequency.setValueAtTime(880, now + 0.3);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.start(now);
            osc.stop(now + 0.5);
        }

        function play1UpSound() {
            const now = audioContext.currentTime;
            const notes = [659, 783, 987, 1318];

            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();

                osc.connect(gain);
                gain.connect(audioContext.destination);

                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);

                gain.gain.setValueAtTime(0.1, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);

                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.2);
            });
        }

        // ===== LOADING SCREEN =====
        window.addEventListener('load', function() {
            let progress = 0;
            const loadingBar = document.getElementById('loading-bar');
            const loadingScreen = document.getElementById('loading-screen');

            const interval = setInterval(() => {
                progress += Math.random() * 12 + 3;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            animateHealthBars();
                        }, 800);
                    }, 600);
                }
                loadingBar.style.width = progress + '%';
            }, 150);
        });

        // ===== TIME COUNTER =====
        function updateTime() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            document.getElementById('game-time').textContent = h + m + s;
        }
        setInterval(updateTime, 1000);
        updateTime();

        // ===== DAY/NIGHT TOGGLE =====
        const dayNightToggle = document.getElementById('day-night-toggle');
        let isNight = false;

        dayNightToggle.addEventListener('click', () => {
            isNight = !isNight;
            document.body.classList.toggle('night-mode');
            dayNightToggle.textContent = isNight ? '🌙' : '☀';
            playBumpSound();
        });

        // ===== HIDDEN BLOCK (1UP) =====
        const hiddenBlock = document.getElementById('hidden-block');
        let blockClicks = 0;

        hiddenBlock.addEventListener('click', () => {
            blockClicks++;
            if (blockClicks >= 3) {
                hiddenBlock.classList.add('revealed');
                play1UpSound();
            } else {
                playBumpSound();
                hiddenBlock.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    hiddenBlock.style.transform = 'translateY(0)';
                }, 200);
            }
        });

        // ===== PIPE TO CONTACT =====
        document.getElementById('pipe-link').addEventListener('click', () => {
            playStartSound();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });

        // ===== KONAMI CODE =====
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    document.getElementById('konami-overlay').classList.add('show');
                    playStartSound();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

        document.getElementById('konami-close').addEventListener('click', () => {
            document.getElementById('konami-overlay').classList.remove('show');
            playBumpSound();
        });

        // ===== CONTACT FORM =====
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            playStartSound();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;

            // Show alert with submitted info
            alert('MESSAGE SENT! 🎮\n\nPlayer: ' + name + '\nEmail: ' + email + '\nSubject: ' + subject + '\nMessage: ' + message.substring(0, 50) + (message.length > 50 ? '...' : '') + '\n\nContinue?');

            // Reset form
            document.getElementById('contact-form').reset();
        });

        // ===== SMOOTH SCROLL =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // ===== REVEAL BLOCK =====
        function revealBlock(block) {
            block.classList.add('revealed');
            setTimeout(() => {
                block.classList.remove('revealed');
            }, 2000);
        }

        // ===== ANIMATE HEALTH BARS =====
        function animateHealthBars() {
            const healthFills = document.querySelectorAll('.health-fill');
            healthFills.forEach(fill => {
                const targetWidth = fill.getAttribute('data-width');
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = targetWidth;
                }, 300);
            });
        }

        // ===== INTERSECTION OBSERVER FOR HEALTH BARS =====
        const skillsSection = document.getElementById('skills');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateHealthBars();
                }
            });
        }, { threshold: 0.3 });

        if (skillsSection) {
            observer.observe(skillsSection);
        }