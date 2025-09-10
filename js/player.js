class Player {
    constructor() {
        this.name = '';
        this.avatar = '';
        this.level = 1;
        this.coins = 0;
        this.gems = 0;
        this.clickPower = 1;
        this.incomePerSec = 0;
        this.ownedUpgrades = [];
        this.ownedCards = [];
        this.totalClicks = 0;
        this.experience = 0;
        this.wins = 0;
        this.playTime = 0;
        this.settings = {
            theme: 'dark',
            soundEnabled: true,
            musicEnabled: true,
            volume: 50
        };
        this.customization = {
            ball: 'default',
            stadium: 'default',
            jersey: 'default',
            effects: 'default'
        };
        this.unlockedItems = {
            ball: ['default'],
            stadium: ['default'],
            jersey: ['default'],
            effects: ['default']
        };
    }

    loadFromStorage() {
        const savedData = localStorage.getItem('footballClickerPlayer');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.assign(this, data);
            return true;
        }
        return false;
    }

    saveToStorage() {
        localStorage.setItem('footballClickerPlayer', JSON.stringify(this));
    }

    addCoins(amount) {
        this.coins += amount;
        this.totalClicks++;
        this.addExperience(amount);
        this.updateUI();
        
        // Воспроизведение звука монет
        if (this.settings.soundEnabled) {
            playSound('coin');
        }
    }

    addGems(amount) {
        this.gems += amount;
        this.updateUI();
        
        // Воспроизведение звука гемов
        if (this.settings.soundEnabled) {
            playSound('gem');
        }
    }

    addExperience(amount) {
        this.experience += amount;
        const expNeeded = this.level * 100;
        
        if (this.experience >= expNeeded) {
            this.level++;
            this.experience -= expNeeded;
            this.showLevelUp();
            
            // Воспроизведение звука уровня
            if (this.settings.soundEnabled) {
                playSound('levelup');
            }
        }
    }

    showLevelUp() {
        const levelUpMsg = document.createElement('div');
        levelUpMsg.className = 'level-up-notification';
        levelUpMsg.innerHTML = `<i class="fas fa-star"></i> Уровень ${this.level}!`;
        document.body.appendChild(levelUpMsg);
        
        setTimeout(() => {
            levelUpMsg.remove();
        }, 3000);
    }

    updateUI() {
        document.getElementById('coinsAmount').textContent = Math.floor(this.coins);
        document.getElementById('gemsAmount').textContent = this.gems;
        document.getElementById('playerLevel').textContent = this.level;
        document.getElementById('clickPower').textContent = this.clickPower;
        document.getElementById('incomePerSec').textContent = this.incomePerSec.toFixed(1);
        
        // Обновление навигации
        document.getElementById('navPlayerName').textContent = this.name;
        document.getElementById('navPlayerLevel').textContent = this.level;
    }

    buyUpgrade(upgrade) {
        if (this.coins >= upgrade.cost && !this.ownedUpgrades.includes(upgrade.id)) {
            this.coins -= upgrade.cost;
            this.ownedUpgrades.push(upgrade.id);
            this.clickPower += upgrade.powerBonus;
            this.incomePerSec += upgrade.incomeBonus;
            this.updateUI();
            this.saveToStorage();
            
            // Воспроизведение звука покупки
            if (this.settings.soundEnabled) {
                playSound('purchase');
            }
            return true;
        }
        return false;
    }

    buyCardPack(pack) {
        if (pack.currency === 'coins' && this.coins >= pack.cost) {
            this.coins -= pack.cost;
            this.openCardPack(pack);
            return true;
        } else if (pack.currency === 'gems' && this.gems >= pack.cost) {
            this.gems -= pack.cost;
            this.openCardPack(pack);
            return true;
        }
        return false;
    }

    openCardPack(pack) {
        const cards = this.generateRandomCards(pack.cardCount, pack.rarity);
        this.ownedCards.push(...cards);
        this.showPackOpening(cards);
        this.updateUI();
        this.saveToStorage();
        
        // Воспроизведение звука открытия пакета
        if (this.settings.soundEnabled) {
            playSound('packopen');
        }
    }

    generateRandomCards(count, maxRarity) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            const rarity = Math.floor(Math.random() * maxRarity) + 1;
            cards.push({
                id: Date.now() + i,
                name: `Карта ${rarity} уровня`,
                rarity: rarity,
                power: rarity * 10,
                income: rarity * 5
            });
        }
        return cards;
    }

    showPackOpening(cards) {
        const packOpening = document.createElement('div');
        packOpening.className = 'pack-opening-modal';
        packOpening.innerHTML = `
            <div class="modal-content">
                <h3>Вы получили:</h3>
                <div class="cards-container">
                    ${cards.map(card => `
                        <div class="card-item rarity-${card.rarity}">
                            <div class="card-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="card-name">${card.name}</div>
                            <div class="card-stats">
                                <div>+${card.power} к клику</div>
                                <div>+${card.income} к доходу</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="this.closest('.pack-opening-modal').remove()">
                    Забрать
                </button>
            </div>
        `;
        document.body.appendChild(packOpening);
    }

    applyTheme(theme) {
        this.settings.theme = theme;
        document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
        this.saveToStorage();
    }

    unlockItem(category, itemId) {
        if (!this.unlockedItems[category].includes(itemId)) {
            this.unlockedItems[category].push(itemId);
            this.saveToStorage();
        }
    }

    applyCustomization(category, itemId) {
        this.customization[category] = itemId;
        this.saveToStorage();
        
        // Применение визуальных изменений
        if (category === 'ball') {
            const footballBtn = document.getElementById('footballBtn');
            const item = window.customization.customizationItems.ball.find(i => i.id === itemId);
            if (item) {
                footballBtn.innerHTML = `<i class="fas ${item.icon}"></i>`;
            }
        }
    }
}