class Shop {
    constructor(game) {
        this.game = game;
        this.packs = [
            {
                id: 'bronze',
                name: 'Бронзовый пакет',
                cost: 100,
                currency: 'coins',
                cardCount: 3,
                rarity: 2,
                description: '3 карты до редкости 2'
            },
            {
                id: 'silver',
                name: 'Серебряный пакет',
                cost: 500,
                currency: 'coins',
                cardCount: 5,
                rarity: 3,
                description: '5 карт до редкости 3'
            },
            {
                id: 'gold',
                name: 'Золотой пакет',
                cost: 10,
                currency: 'gems',
                cardCount: 3,
                rarity: 4,
                description: '3 карты до редкости 4'
            },
            {
                id: 'platinum',
                name: 'Платиновый пакет',
                cost: 50,
                currency: 'gems',
                cardCount: 5,
                rarity: 5,
                description: '5 карт до редкости 5'
            }
        ];
        
        this.renderShop();
    }

    renderShop() {
        const shopContainer = document.getElementById('shopItems');
        shopContainer.innerHTML = '';
        
        this.packs.forEach(pack => {
            const packElement = document.createElement('div');
            packElement.className = 'card-pack shine-effect';
            packElement.innerHTML = `
                <div class="pack-header">
                    <h5>${pack.name}</h5>
                    <div class="pack-cost">
                        ${pack.currency === 'coins' ? 
                            `<i class="fas fa-coins"></i> ${pack.cost}` : 
                            `<i class="fas fa-gem"></i> ${pack.cost}`
                        }
                    </div>
                </div>
                <p class="pack-description">${pack.description}</p>
                <button class="btn btn-primary w-100" onclick="game.shop.buyPack('${pack.id}')">
                    Купить
                </button>
            `;
            shopContainer.appendChild(packElement);
        });
    }

    buyPack(packId) {
        const pack = this.packs.find(p => p.id === packId);
        if (pack && this.game.player.buyCardPack(pack)) {
            // Анимация покупки
            const packElement = event.target.closest('.card-pack');
            packElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                packElement.style.transform = 'scale(1)';
            }, 200);
        } else {
            // Показ сообщения о недостатке средств
            this.showInsufficientFunds(pack.currency);
        }
    }

    showInsufficientFunds(currency) {
        const message = document.createElement('div');
        message.className = 'insufficient-funds';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-exclamation-triangle"></i>
                Недостаточно ${currency === 'coins' ? 'монет' : 'гемов'}!
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}