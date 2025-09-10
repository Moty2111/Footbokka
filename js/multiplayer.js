class Multiplayer {
    constructor(game) {
        this.game = game;
        this.aiDifficulty = 'normal';
        this.setupAI();
    }

    setupAI() {
        // Настройка поведения ИИ
        this.aiBehavior = {
            normal: {
                reactionTime: 2000,
                powerMultiplier: 1,
                strategy: 'balanced'
            },
            hard: {
                reactionTime: 1000,
                powerMultiplier: 1.5,
                strategy: 'aggressive'
            },
            easy: {
                reactionTime: 3000,
                powerMultiplier: 0.7,
                strategy: 'defensive'
            }
        };
    }

    setDifficulty(difficulty) {
        this.aiDifficulty = difficulty;
    }

    getAIPower() {
        const behavior = this.aiBehavior[this.aiDifficulty];
        const basePower = 5;
        const timeBonus = Math.floor(this.game.matchTime / 10);
        
        return Math.floor((basePower + timeBonus) * behavior.powerMultiplier);
    }

    simulateAIMove() {
        if (!this.game.matchActive) return;
        
        const behavior = this.aiBehavior[this.aiDifficulty];
        const aiPower = this.getAIPower();
        
        // Обновление счета ИИ
        const currentScore = parseInt(document.getElementById('aiScore').textContent);
        document.getElementById('aiScore').textContent = currentScore + aiPower;
        
        // Визуальная обратная связь
        const aiCard = document.querySelector('.player-card.ai');
        aiCard.classList.add('pulse');
        setTimeout(() => {
            aiCard.classList.remove('pulse');
        }, 500);
    }

    startAIMatch() {
        // Запуск симуляции ИИ
        this.aiInterval = setInterval(() => {
            if (this.game.matchActive) {
                this.simulateAIMove();
            }
        }, this.aiBehavior[this.aiDifficulty].reactionTime);
    }

    stopAIMatch() {
        clearInterval(this.aiInterval);
    }

    getMatchResult() {
        const playerScore = parseInt(document.getElementById('playerScore').textContent);
        const aiScore = parseInt(document.getElementById('aiScore').textContent);
        
        let result = {
            winner: playerScore > aiScore ? 'player' : (playerScore < aiScore ? 'ai' : 'draw'),
            playerScore: playerScore,
            aiScore: aiScore,
            reward: 0
        };
        
        // Расчет награды
        if (result.winner === 'player') {
            result.reward = 50 + (this.aiDifficulty === 'hard' ? 30 : 0);
        } else if (result.winner === 'draw') {
            result.reward = 25;
        } else {
            result.reward = 10;
        }
        
        return result;
    }
}