class Game {
    constructor() {
        this.player = new Player();
        this.isRunning = false;
        this.incomeInterval = null;
        this.matchActive = false;
        this.matchInterval = null;
        this.matchTime = 0;
        this.startTime = Date.now();
    }

    init() {
        // Загрузка данных игрока
        if (this.player.loadFromStorage()) {
            this.showGameScreen();
            this.player.updateUI();
            this.applyPlayerSettings();
        } else {
            this.showRegistrationScreen();
        }

        // Настройка обработчиков событий
        this.setupEventListeners();
        
        // Запуск пассивного дохода
        this.startIncomeGeneration();
        
        // Запуск отслеживания времени игры
        this.startPlayTimeTracking();
    }

    setupEventListeners() {
        // Регистрация
        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        // Выбор аватара
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Клик по мячу
        document.getElementById('footballBtn').addEventListener('click', (e) => {
            this.handleFootballClick(e);
        });

        // Кнопки мультиплеера
        document.getElementById('startMatchBtn').addEventListener('click', () => {
            this.startMatch();
        });

        document.getElementById('endMatchBtn').addEventListener('click', () => {
            this.endMatch();
        });

        // Кнопка выхода
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    handleRegistration() {
        const name = document.getElementById('playerName').value;
        const selectedAvatar = document.querySelector('.avatar-option.selected');
        
        if (!name || !selectedAvatar) {
            alert('Пожалуйста, заполните все поля и выберите аватар!');
            return;
        }

        this.player.name = name;
        this.player.avatar = selectedAvatar.dataset.avatar;
        this.player.saveToStorage();
        
        this.showGameScreen();
        this.player.updateUI();
    }

    showRegistrationScreen() {
        document.getElementById('registrationScreen').style.display = 'block';
        document.getElementById('gameScreen').style.display = 'none';
    }

    showGameScreen() {
        document.getElementById('registrationScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        // Обновление аватара
        const avatarIcon = document.getElementById('playerAvatarIcon');
        const navAvatarIcon = document.getElementById('navPlayerAvatarIcon');
        const avatarClass = document.querySelector(`.avatar-option[data-avatar="${this.player.avatar}"] i`).className;
        if (avatarIcon) avatarIcon.className = avatarClass;
        if (navAvatarIcon) navAvatarIcon.className = avatarClass;
        
        // Обновление имени
        document.getElementById('playerNameDisplay').textContent = this.player.name;
    }

    applyPlayerSettings() {
        // Применение темы
        this.player.applyTheme(this.player.settings.theme);
        
        // Применение громкости
        if (window.audioContext) {
            window.audioContext.volume = this.player.settings.volume / 100;
        }
    }

    handleFootballClick(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        
        // Добавление монет
        this.player.addCoins(this.player.clickPower);
        
        // Создание эффекта клика
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = `+${this.player.clickPower}`;
        effect.style.left = `${Math.random() * 100}px`;
        effect.style.top = `${Math.random() * 100}px`;
        button.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
        
        // Анимация кнопки
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
        // Воспроизведение звука клика
        if (this.player.settings.soundEnabled) {
            playSound('click');
        }
        
        // Обновление счета в матче
        if (this.matchActive) {
            const currentScore = parseInt(document.getElementById('playerScore').textContent);
            document.getElementById('playerScore').textContent = currentScore + this.player.clickPower;
        }
    }

    startIncomeGeneration() {
        this.incomeInterval = setInterval(() => {
            if (this.player.incomePerSec > 0) {
                this.player.addCoins(this.player.incomePerSec / 10); // Раз в 100мс
            }
        }, 100);
    }

    startPlayTimeTracking() {
        setInterval(() => {
            this.player.playTime++;
            this.player.saveToStorage();
        }, 1000);
    }

    startMatch() {
        this.matchActive = true;
        this.matchTime = 0;
        
        document.getElementById('startMatchBtn').classList.add('d-none');
        document.getElementById('endMatchBtn').classList.remove('d-none');
        
        // Сброс счетов
        document.getElementById('playerScore').textContent = '0';
        document.getElementById('aiScore').textContent = '0';
        
        // Запуск таймера матча
        this.matchInterval = setInterval(() => {
            this.matchTime++;
            const minutes = Math.floor(this.matchTime / 60);
            const seconds = this.matchTime % 60;
            document.getElementById('matchTimer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // ИИ делает ход
            if (this.matchTime % 2 === 0) {
                const aiScore = parseInt(document.getElementById('aiScore').textContent);
                const aiPower = 5 + Math.floor(this.matchTime / 10); // ИИ становится сильнее со временем
                document.getElementById('aiScore').textContent = aiScore + aiPower;
            }
            
            // Проверка окончания матча (3 минуты)
            if (this.matchTime >= 180) {
                this.endMatch();
            }
        }, 1000);
    }

    endMatch() {
        this.matchActive = false;
        clearInterval(this.matchInterval);
        
        document.getElementById('startMatchBtn').classList.remove('d-none');
        document.getElementById('endMatchBtn').classList.add('d-none');
        
        // Определение победителя
        const playerScore = parseInt(document.getElementById('playerScore').textContent);
        const aiScore = parseInt(document.getElementById('aiScore').textContent);
        
        let resultMessage = '';
        if (playerScore > aiScore) {
            resultMessage = 'Победа! +50 монет';
            this.player.addCoins(50);
            this.player.wins++;
        } else if (playerScore < aiScore) {
            resultMessage = 'Поражение! +10 монет за усилия';
            this.player.addCoins(10);
        } else {
            resultMessage = 'Ничья! +25 монет';
            this.player.addCoins(25);
        }
        
        // Показ результата
        const resultDiv = document.createElement('div');
        resultDiv.className = 'match-result';
        resultDiv.innerHTML = `
            <div class="result-content">
                <h3>${resultMessage}</h3>
                <p>Ваш счет: ${playerScore} | Счет ИИ: ${aiScore}</p>
                <button class="btn btn-primary" onclick="this.closest('.match-result').remove()">OK</button>
            </div>
        `;
        document.body.appendChild(resultDiv);
        
        // Сохранение статистики
        this.player.saveToStorage();
        
        // Проверка достижений
        if (window.achievements) {
            window.achievements.checkAchievements();
        }
    }

    logout() {
        if (confirm('Вы уверены, что хотите выйти? Весь прогресс будет сохранен.')) {
            this.player.saveToStorage();
            localStorage.removeItem('footballClickerPlayer');
            location.reload();
        }
    }
}