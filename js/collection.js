class Collection {
    constructor(game) {
        this.game = game;
        this.currentFilter = 'all';
        this.cardTemplates = [];
        this.loadCardTemplates();
        this.setupFilters();
        this.renderCollection();
    }

    loadCardTemplates() {
        // Загрузка шаблонов карт из файла или определение
        fetch('data/cards.json')
            .then(response => response.json())
            .then(data => {
                this.cardTemplates = data.cardTemplates;
                this.renderCollection();
            })
            .catch(error => {
                console.error('Error loading card templates:', error);
                // Использование шаблонов по умолчанию
                this.cardTemplates = [
                    { id: 'speed_boots', name: 'Бутсы скорости', rarity: 1, power: 2, income: 0 },
                    { id: 'golden_ball', name: 'Золотой мяч', rarity: 3, power: 5, income: 3 },
                    { id: 'stadium', name: 'Стадион мечты', rarity: 5, power: 0, income: 20 }
                ];
                this.renderCollection();
            });
    }

    setupFilters() {
        document.querySelectorAll('.collection-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.collection-filters .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.rarity;
                this.renderCollection();
            });
        });
    }

    renderCollection() {
        const container = document.getElementById('collectionGrid');
        container.innerHTML = '';

        if (this.cardTemplates.length === 0) {
            container.innerHTML = '<p class="text-center">Загрузка коллекции...</p>';
            return;
        }

        this.cardTemplates.forEach(template => {
            if (this.currentFilter !== 'all' && template.rarity.toString() !== this.currentFilter) {
                return;
            }

            const owned = this.game.player.ownedCards.some(card => card.id === template.id);
            const card = document.createElement('div');
            card.className = `collection-card ${owned ? 'owned' : 'missing'}`;
            card.innerHTML = `
                <div class="collection-card-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div class="collection-card-name">${template.name}</div>
                <div class="collection-card-rarity rarity-${template.rarity}">
                    ${this.getRarityName(template.rarity)}
                </div>
                ${owned ? `
                    <div class="collection-card-stats">
                        <div><i class="fas fa-fist-raised"></i> +${template.power}</div>
                        <div><i class="fas fa-coins"></i> +${template.income}/сек</div>
                    </div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }

    getRarityName(rarity) {
        const names = {
            1: 'Обычная',
            2: 'Редкая',
            3: 'Эпическая',
            4: 'Легендарная',
            5: 'Мифическая'
        };
        return names[rarity] || 'Неизвестная';
    }
}