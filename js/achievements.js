class Achievements {
    constructor(game) {
        this.game = game;
        this.achievements = [];
        this.loadAchievements();
        this.renderAchievements();
        this.checkAchievements();
    }

    loadAchievements() {
        // Загрузка из файла или определение достижений
        this.achievements = [
            {
                id: 'first_click',
                name: 'Первый шаг',
                description: 'Сделайте свой первый клик',
                icon: 'fa-mouse-pointer',
                condition: { type: 'clicks', value: 1 },
                reward: { coins: 10, gems: 0 },
                completed: false
            },
            {
                id: 'click_master',
                name: 'Мастер клика',
                description: 'Сделайте 100 кликов',
                icon: 'fa-hand-pointer',
                condition: { type: 'clicks', value: 100 },
                reward: { coins: 100, gems: 1 },
                completed: false
            },
            {
                id: 'coin_collector',
                name: 'Собиратель монет',
                description: 'Накопите 1000 монет',
                icon: 'fa-coins',
                condition: { type: 'coins', value: 1000 },
                reward: { coins: 0, gems: 5 },
                completed: false
            },
            {
                id: 'gem_hunter',
                name: 'Охотник за гемами',
                description: 'Получите 10 гемов',
                icon: 'fa-gem',
                condition: { type: 'gems', value: 10 },
                reward: { coins: 500, gems: 0 },
                completed: false
            },
            {
                id: 'level_5',
                name: 'Опытный игрок',
                description: 'Достигните 5 уровня',
                icon: 'fa-level-up-alt',
                condition: { type: 'level', value: 5 },
                reward: { coins: 200, gems: 2 },
                completed: false
            },
            {
                id: 'shopaholic',
                name: 'Шопоголик',
                description: 'Купите 5 улучшений',
                icon: 'fa-shopping-cart',
                condition: { type: 'upgrades', value: 5 },
                reward: { coins: 300, gems: 3 },
                completed: false
            },
            {
                id: 'card_collector',
                name: 'Коллекционер',
                description: 'Соберите 10 карт',
                icon: 'fa-layer-group',
                condition: { type: 'cards', value: 10 },
                reward: { coins: 400, gems: 4 },
                completed: false
            },
            {
                id: 'match_winner',
                name: 'Победитель',
                description: 'Выиграйте 5 матчей',
                icon: 'fa-trophy',
                condition: { type: 'wins', value: 5 },
                reward: { coins: 500, gems: 5 },
                completed: false
            }
        ];

        // Загрузка прогресса достижений
        const savedProgress = localStorage.getItem('footballClickerAchievements');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.achievements.forEach(achievement => {
                const saved = progress.find(a => a.id === achievement.id);
                if (saved) {
                    achievement.completed = saved.completed;
                }
            });
        }
    }

    saveProgress() {
        const progress = this.achievements.map(a => ({
            id: a.id,
            completed: a.completed
        }));
        localStorage.setItem('footballClickerAchievements', JSON.stringify(progress));
    }

    renderAchievements() {
        const container = document.getElementById('achievementsList');
        container.innerHTML = '';

        this.achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.completed ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="achievement-icon">
                    <i class="fas ${achievement.icon}"></i>
                </div>
                <div class="achievement-title">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-reward">
                    Награда: ${achievement.reward.coins > 0 ? `<i class="fas fa-coins"></i> ${achievement.reward.coins}` : ''}
                    ${achievement.reward.gems > 0 ? `<i class="fas fa-gem"></i> ${achievement.reward.gems}` : ''}
                </div>
                <div class="achievement-progress">
                    <div class="achievement-progress-bar" style="width: ${this.getProgress(achievement)}%"></div>
                </div>
            `;
            container.appendChild(card);
        });

        this.updateStats();
    }

    getProgress(achievement) {
        const currentValue = this.getCurrentValue(achievement.condition.type);
        const targetValue = achievement.condition.value;
        return Math.min((currentValue / targetValue) * 100, 100);
    }

    getCurrentValue(type) {
        switch(type) {
            case 'clicks': return this.game.player.totalClicks;
            case 'coins': return Math.floor(this.game.player.coins);
            case 'gems': return this.game.player.gems;
            case 'level': return this.game.player.level;
            case 'upgrades': return this.game.player.ownedUpgrades.length;
            case 'cards': return this.game.player.ownedCards.length;
            case 'wins': return this.game.player.wins || 0;
            default: return 0;
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.completed) {
                const currentValue = this.getCurrentValue(achievement.condition.type);
                if (currentValue >= achievement.condition.value) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    unlockAchievement(achievement) {
        achievement.completed = true;
        this.saveProgress();
        
        // Выдача награды
        if (achievement.reward.coins > 0) {
            this.game.player.addCoins(achievement.reward.coins);
        }
        if (achievement.reward.gems > 0) {
            this.game.player.addGems(achievement.reward.gems);
        }

        // Показ уведомления
        window.ui.showNotification(
            `Достижение разблокировано: ${achievement.name}!`,
            'success',
            5000
        );

        // Обновление отображения
        this.renderAchievements();
    }

    updateStats() {
        const completed = this.achievements.filter(a => a.completed).length;
        const total = this.achievements.length;
        const progress = Math.round((completed / total) * 100);

        document.getElementById('achievementsCompleted').textContent = completed;
        document.getElementById('achievementsProgress').textContent = `${progress}%`;
    }
}