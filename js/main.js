// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создание экземпляров классов
    window.game = new Game();
    window.ui = new UIManager();
    window.navigation = new Navigation();
    window.soundManager = new SoundManager();
    
    // Инициализация компонентов
    game.upgrades = new Upgrades(game);
    game.shop = new Shop(game);
    game.multiplayer = new Multiplayer(game);
    
    // Запуск игры
    game.init();
    
    // Добавление глобальных обработчиков
    window.addEventListener('beforeunload', () => {
        if (game.player) {
            game.player.saveToStorage();
        }
    });
    
    // Обработка видимости страницы
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Страница скрыта - можно приостановить игру
            console.log('Игра приостановлена');
        } else {
            // Страница видима - возобновить игру
            console.log('Игра возобновлена');
        }
    });
    
    // Показ приветственного сообщения
    setTimeout(() => {
        if (game.player.name) {
            ui.showNotification(`С возвращением, ${game.player.name}!`, 'success');
        }
    }, 1000);

    // Добавление очков навыков при повышении уровня
    const originalAddExperience = game.player.addExperience;
    game.player.addExperience = function(amount) {
        originalAddExperience.call(this, amount);
        
        // Проверка повышения уровня
        const expNeeded = this.level * 100;
        if (this.experience >= expNeeded) {
            // Добавление очка навыка
            if (window.skillTree) {
                window.skillTree.addSkillPoints(1);
                ui.showNotification('Получено 1 очко навыка!', 'success');
            }
        }
    };

    // Применение сохраненной громкости
    if (game.player.settings) {
        soundManager.setVolume(game.player.settings.volume);
        soundManager.setEnabled(game.player.settings.soundEnabled);
    }
});

// Глобальные функции для обратной совместимости
function buyUpgrade(upgradeId) {
    game.upgrades.buyUpgrade(upgradeId);
}

function buyPack(packId) {
    game.shop.buyPack(packId);
}