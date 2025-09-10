class Upgrades {
    constructor(game) {
        this.game = game;
        this.upgrades = [
            {
                id: 'boot1',
                name: 'Бутсы новичка',
                cost: 50,
                powerBonus: 1,
                incomeBonus: 0,
                description: '+1 к силе клика'
            },
            {
                id: 'boot2',
                name: 'Профессиональные бутсы',
                cost: 200,
                powerBonus: 3,
                incomeBonus: 0,
                description: '+3 к силе клика'
            },
            {
                id: 'stadium1',
                name: 'Мини-стадион',
                cost: 500,
                powerBonus: 0,
                incomeBonus: 2,
                description: '+2 к доходу в секунду'
            },
            {
                id: 'stadium2',
                name: 'Большой стадион',
                cost: 2000,
                powerBonus: 0,
                incomeBonus: 10,
                description: '+10 к доходу в секунду'
            },
            {
                id: 'training',
                name: 'Тренировочный лагерь',
                cost: 1000,
                powerBonus: 5,
                incomeBonus: 5,
                description: '+5 к клику и +5 к доходу'
            },
            {
                id: 'sponsor',
                name: 'Спонсорский контракт',
                cost: 5000,
                powerBonus: 0,
                incomeBonus: 50,
                description: '+50 к доходу в секунду'
            }
        ];
        
        this.renderUpgrades();
    }

    renderUpgrades() {
        const upgradesContainer = document.getElementById('upgradesList');
        upgradesContainer.innerHTML = '';
        
        this.upgrades.forEach(upgrade => {
            const isOwned = this.game.player.ownedUpgrades.includes(upgrade.id);
            const canAfford = this.game.player.coins >= upgrade.cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-card ${isOwned ? 'owned' : ''} ${canAfford && !isOwned ? 'clickable' : ''}`;
            upgradeElement.innerHTML = `
                <div class="upgrade-header">
                    <h6>${upgrade.name}</h6>
                    ${isOwned ? '<span class="badge bg-success">Куплено</span>' : ''}
                </div>
                <p class="upgrade-description">${upgrade.description}</p>
                <div class="upgrade-cost">
                    <i class="fas fa-coins"></i> ${upgrade.cost}
                </div>
                ${!isOwned ? `
                    <button class="btn btn-sm ${canAfford ? 'btn-primary' : 'btn-secondary disabled'} w-100 mt-2" 
                            onclick="game.upgrades.buyUpgrade('${upgrade.id}')"
                            ${!canAfford ? 'disabled' : ''}>
                        Купить
                    </button>
                ` : ''}
            `;
            
            // Добавление обработчика клика на всю карточку
            if (canAfford && !isOwned) {
                upgradeElement.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('btn')) {
                        this.buyUpgrade(upgrade.id);
                    }
                });
            }
            
            upgradesContainer.appendChild(upgradeElement);
        });
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (upgrade && this.game.player.buyUpgrade(upgrade)) {
            this.renderUpgrades();
            
            // Анимация покупки
            const upgradeElement = event.target.closest('.upgrade-card');
            upgradeElement.classList.add('pulse');
            setTimeout(() => {
                upgradeElement.classList.remove('pulse');
            }, 1000);
        }
    }
}