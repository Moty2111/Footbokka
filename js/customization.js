class Customization {
    constructor(game) {
        this.game = game;
        this.currentTab = 'ball';
        this.customizationItems = {
            ball: [
                { id: 'default', name: 'Стандартный', icon: 'fa-futbol', unlocked: true },
                { id: 'golden', name: 'Золотой', icon: 'fa-futbol', unlocked: false, cost: 100 },
                { id: 'fire', name: 'Огненный', icon: 'fa-fire', unlocked: false, cost: 200 },
                { id: 'ice', name: 'Ледяной', icon: 'fa-snowflake', unlocked: false, cost: 200 },
                { id: 'rainbow', name: 'Радужный', icon: 'fa-rainbow', unlocked: false, cost: 500 }
            ],
            stadium: [
                { id: 'default', name: 'Поле', icon: 'fa-map', unlocked: true },
                { id: 'arena', name: 'Арена', icon: 'fa-building', unlocked: false, cost: 1000 },
                { id: 'temple', name: 'Храм', icon: 'fa-torii-gate', unlocked: false, cost: 2000 },
                { id: 'space', name: 'Космос', icon: 'fa-rocket', unlocked: false, cost: 5000 }
            ],
            jersey: [
                { id: 'default', name: 'Стандартная', icon: 'fa-tshirt', unlocked: true },
                { id: 'vintage', name: 'Винтажная', icon: 'fa-tshirt', unlocked: false, cost: 300 },
                { id: 'modern', name: 'Современная', icon: 'fa-tshirt', unlocked: false, cost: 500 },
                { id: 'legendary', name: 'Легендарная', icon: 'fa-tshirt', unlocked: false, cost: 1000 }
            ],
            effects: [
                { id: 'default', name: 'Нет', icon: 'fa-ban', unlocked: true },
                { id: 'sparkles', name: 'Искры', icon: 'fa-sparkles', unlocked: false, cost: 50 },
                { id: 'lightning', name: 'Молнии', icon: 'fa-bolt', unlocked: false, cost: 100 },
                { id: 'explosion', name: 'Взрывы', icon: 'fa-bomb', unlocked: false, cost: 200 }
            ]
        };

        this.loadCustomization();
        this.setupTabs();
        this.renderCurrentTab();
        this.applyAllCustomization();
    }

    loadCustomization() {
        // Загрузка текущей кастомизации
        const saved = localStorage.getItem('footballClickerCustomization');
        if (saved) {
            this.game.player.customization = { ...this.game.player.customization, ...JSON.parse(saved) };
        }

        // Загрузка разблокированных предметов
        const savedUnlocks = localStorage.getItem('footballClickerUnlocks');
        if (savedUnlocks) {
            const unlocks = JSON.parse(savedUnlocks);
            Object.keys(unlocks).forEach(category => {
                unlocks[category].forEach(itemId => {
                    const item = this.customizationItems[category].find(i => i.id === itemId);
                    if (item) {
                        item.unlocked = true;
                    }
                });
            });
        }
    }

    saveCustomization() {
        localStorage.setItem('footballClickerCustomization', JSON.stringify(this.game.player.customization));
    }

    saveUnlocks() {
        const unlocks = {};
        Object.keys(this.customizationItems).forEach(category => {
            unlocks[category] = this.customizationItems[category]
                .filter(item => item.unlocked)
                .map(item => item.id);
        });
        localStorage.setItem('footballClickerUnlocks', JSON.stringify(unlocks));
    }

    setupTabs() {
        document.querySelectorAll('#customizationSection .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentTab = btn.dataset.tab;
                this.renderCurrentTab();
            });
        });
    }

    renderCurrentTab() {
        const container = document.getElementById('customizationContent');
        container.innerHTML = `
            <div class="tab-content" data-tab="${this.currentTab}">
                <div class="customization-items">
                    ${this.customizationItems[this.currentTab].map(item => `
                        <div class="customization-item ${item.unlocked ? '' : 'locked'} ${this.game.player.customization[this.currentTab] === item.id ? 'selected' : ''}" 
                             data-id="${item.id}">
                            <div class="customization-item-icon">
                                <i class="fas ${item.icon}"></i>
                            </div>
                            <div class="customization-item-name">${item.name}</div>
                            ${!item.unlocked ? `
                                <div class="customization-item-cost">
                                    <i class="fas fa-coins"></i> ${item.cost}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Добавление обработчиков
        container.querySelectorAll('.customization-item').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const itemId = itemEl.dataset.id;
                const item = this.customizationItems[this.currentTab].find(i => i.id === itemId);
                
                if (item.unlocked) {
                    // Применение кастомизации
                    this.game.player.customization[this.currentTab] = itemId;
                    this.saveCustomization();
                    this.renderCurrentTab();
                    this.applyCustomization(this.currentTab, itemId);
                } else {
                    // Покупка разблокировки
                    if (this.game.player.coins >= item.cost) {
                        this.game.player.coins -= item.cost;
                        item.unlocked = true;
                        this.game.player.unlockItem(this.currentTab, itemId);
                        this.saveUnlocks();
                        this.game.player.updateUI();
                        this.renderCurrentTab();
                        window.ui.showNotification(`${item.name} разблокирован!`, 'success');
                    } else {
                        window.ui.showNotification('Недостаточно монет!', 'error');
                    }
                }
            });
        });
    }

    applyCustomization(category, itemId) {
        switch(category) {
            case 'ball':
                this.applyBallCustomization(itemId);
                break;
            case 'stadium':
                this.applyStadiumCustomization(itemId);
                break;
            case 'jersey':
                this.applyJerseyCustomization(itemId);
                break;
            case 'effects':
                this.applyEffectsCustomization(itemId);
                break;
        }
    }

    applyBallCustomization(ballId) {
        const footballBtn = document.getElementById('footballBtn');
        const item = this.customizationItems.ball.find(i => i.id === ballId);
        
        if (item) {
            footballBtn.innerHTML = `<i class="fas ${item.icon}"></i>`;
            
            // Применение специальных эффектов
            footballBtn.className = 'football-button';
            if (ballId === 'golden') {
                footballBtn.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
            } else if (ballId === 'fire') {
                footballBtn.style.background = 'linear-gradient(45deg, #ff4500, #ff6347)';
            } else if (ballId === 'ice') {
                footballBtn.style.background = 'linear-gradient(45deg, #00bfff, #87ceeb)';
            } else if (ballId === 'rainbow') {
                footballBtn.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
                footballBtn.style.backgroundSize = '400% 400%';
                footballBtn.style.animation = 'rainbow 3s ease infinite';
            }
        }
    }

    applyStadiumCustomization(stadiumId) {
        const clickerSection = document.querySelector('.clicker-section');
        const item = this.customizationItems.stadium.find(i => i.id === stadiumId);
        
        if (item) {
            // Изменение фона секции кликера
            clickerSection.style.backgroundImage = `url('assets/images/stadium_${stadiumId}.jpg')`;
            clickerSection.style.backgroundSize = 'cover';
            clickerSection.style.backgroundPosition = 'center';
        }
    }

    applyJerseyCustomization(jerseyId) {
        const playerAvatar = document.querySelector('.player-avatar');
        const item = this.customizationItems.jersey.find(i => i.id === jerseyId);
        
        if (item) {
            // Изменение цвета аватара игрока
            if (jerseyId === 'vintage') {
                playerAvatar.style.background = 'linear-gradient(45deg, #8b4513, #d2691e)';
            } else if (jerseyId === 'modern') {
                playerAvatar.style.background = 'linear-gradient(45deg, #1e90ff, #00bfff)';
            } else if (jerseyId === 'legendary') {
                playerAvatar.style.background = 'linear-gradient(45deg, #ff1493, #ff69b4)';
            }
        }
    }

    applyEffectsCustomization(effectId) {
        const footballBtn = document.getElementById('footballBtn');
        
        // Удаление всех классов эффектов
        footballBtn.classList.remove('effect-sparkles', 'effect-lightning', 'effect-explosion');
        
        if (effectId !== 'default') {
            footballBtn.classList.add(`effect-${effectId}`);
        }
    }

    applyAllCustomization() {
        // Применение всей сохраненной кастомизации
        Object.keys(this.game.player.customization).forEach(category => {
            this.applyCustomization(category, this.game.player.customization[category]);
        });
    }
}