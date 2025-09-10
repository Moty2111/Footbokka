class Settings {
    constructor(game) {
        this.game = game;
        this.settings = {
            volume: 50,
            soundEffects: true,
            music: true,
            theme: 'dark',
            animations: true,
            particles: true,
            autoSave: true,
            aiDifficulty: 'normal',
            language: 'ru'
        };
        
        this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('footballClickerSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // Применение настроек к игроку
        this.game.player.settings = {
            theme: this.settings.theme,
            soundEnabled: this.settings.soundEffects,
            musicEnabled: this.settings.music,
            volume: this.settings.volume
        };
    }

    saveSettings() {
        localStorage.setItem('footballClickerSettings', JSON.stringify(this.settings));
        
        // Обновление настроек игрока
        this.game.player.settings = {
            theme: this.settings.theme,
            soundEnabled: this.settings.soundEffects,
            musicEnabled: this.settings.music,
            volume: this.settings.volume
        };
        this.game.player.saveToStorage();
    }

    setupEventListeners() {
        // Громкость
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = this.settings.volume;
            volumeSlider.addEventListener('input', (e) => {
                this.settings.volume = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Звуковые эффекты
        const soundEffectsToggle = document.getElementById('soundEffectsToggle');
        if (soundEffectsToggle) {
            soundEffectsToggle.checked = this.settings.soundEffects;
            soundEffectsToggle.addEventListener('change', (e) => {
                this.settings.soundEffects = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Музыка
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.checked = this.settings.music;
            musicToggle.addEventListener('change', (e) => {
                this.settings.music = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Тема
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.settings.theme;
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Анимации
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.settings.animations;
            animationsToggle.addEventListener('change', (e) => {
                this.settings.animations = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Частицы
        const particlesToggle = document.getElementById('particlesToggle');
        if (particlesToggle) {
            particlesToggle.checked = this.settings.particles;
            particlesToggle.addEventListener('change', (e) => {
                this.settings.particles = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Автосохранение
        const autoSaveToggle = document.getElementById('autoSaveToggle');
        if (autoSaveToggle) {
            autoSaveToggle.checked = this.settings.autoSave;
            autoSaveToggle.addEventListener('change', (e) => {
                this.settings.autoSave = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Сложность ИИ
        const aiDifficultySelect = document.getElementById('aiDifficultySelect');
        if (aiDifficultySelect) {
            aiDifficultySelect.value = this.settings.aiDifficulty;
            aiDifficultySelect.addEventListener('change', (e) => {
                this.settings.aiDifficulty = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Язык
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.settings.language;
            languageSelect.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Кнопки управления данными
        document.getElementById('exportSaveBtn')?.addEventListener('click', () => {
            this.exportSave();
        });

        document.getElementById('importSaveBtn')?.addEventListener('click', () => {
            this.importSave();
        });

        document.getElementById('resetGameBtn')?.addEventListener('click', () => {
            this.resetGame();
        });
    }

    applySettings() {
        // Применение темы
        this.applyTheme(this.settings.theme);

        // Применение настроек анимаций
        if (!this.settings.animations) {
            document.body.style.setProperty('--animation-duration', '0s');
        } else {
            document.body.style.setProperty('--animation-duration', '0.3s');
        }

        // Применение настроек частиц
        if (!this.settings.particles) {
            document.body.classList.add('no-particles');
        } else {
            document.body.classList.remove('no-particles');
        }

        // Применение громкости
        if (window.audioContext) {
            window.audioContext.volume = this.settings.volume / 100;
        }

        // Применение сложности ИИ
        if (window.game && window.game.multiplayer) {
            window.game.multiplayer.setDifficulty(this.settings.aiDifficulty);
        }

        // Применение языка (здесь можно добавить логику смены языка)
        console.log('Language set to:', this.settings.language);
    }

    applyTheme(theme) {
        // Удаление всех классов темы
        document.body.classList.remove('dark-theme', 'light-theme');
        
        // Применение выбранной темы
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'auto') {
            // Автоматическое определение темы
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
        }
    }

    exportSave() {
        const saveData = {
            player: this.game.player,
            settings: this.settings,
            timestamp: Date.now()
        };

        const dataStr = JSON.stringify(saveData);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `football-clicker-save-${new Date().toISOString().slice(0,10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        window.ui.showNotification('Сохранение экспортировано!', 'success');
    }

    importSave() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = event => {
                try {
                    const saveData = JSON.parse(event.target.result);
                    
                    // Восстановление данных игрока
                    if (saveData.player) {
                        Object.assign(this.game.player, saveData.player);
                        this.game.player.updateUI();
                        this.game.player.saveToStorage();
                    }

                    // Восстановление настроек
                    if (saveData.settings) {
                        this.settings = { ...this.settings, ...saveData.settings };
                        this.saveSettings();
                        this.applySettings();
                        this.setupEventListeners(); // Обновление UI настроек
                    }

                    window.ui.showNotification('Сохранение импортировано!', 'success');
                    
                    // Перезагрузка страницы для применения всех изменений
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } catch (error) {
                    window.ui.showNotification('Ошибка при импорте сохранения!', 'error');
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    resetGame() {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие необратимо!')) {
            // Очистка всех данных
            localStorage.removeItem('footballClickerPlayer');
            localStorage.removeItem('footballClickerSettings');
            localStorage.removeItem('footballClickerAchievements');
            localStorage.removeItem('footballClickerSkillTree');
            localStorage.removeItem('footballClickerCustomization');
            localStorage.removeItem('footballClickerUnlocks');
            
            // Перезагрузка страницы
            location.reload();
        }
    }
}