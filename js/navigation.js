class Navigation {
    constructor() {
        this.currentSection = 'main';
        this.setupNavigation();
    }

    setupNavigation() {
        // Обработчики кнопок навигации
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchSection(section);
            });
        });

        // Обработчики вкладок в разделах
        this.setupTabSwitching();
    }

    switchSection(sectionName) {
        // Скрыть все секции
        document.querySelectorAll('.game-section').forEach(section => {
            section.classList.remove('active');
        });

        // Показать выбранную секцию
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Обновить активную кнопку навигации
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            }
        });

        this.currentSection = sectionName;

        // Инициализация контента секции при первом открытии
        this.initSectionContent(sectionName);
    }

    setupTabSwitching() {
        // Вкладки кастомизации
        document.querySelectorAll('#customizationSection .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab('customization', tab);
            });
        });

        // Вкладки социальных функций
        document.querySelectorAll('#socialSection .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab('social', tab);
            });
        });
    }

    switchTab(sectionName, tabName) {
        const section = document.getElementById(`${sectionName}Section`);
        
        // Скрыть весь контент вкладок
        section.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        // Показать контент выбранной вкладки
        const tabContent = section.querySelector(`.tab-content[data-tab="${tabName}"]`);
        if (tabContent) {
            tabContent.style.display = 'block';
        }

        // Обновить активные кнопки
        section.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
    }

    initSectionContent(sectionName) {
        switch(sectionName) {
            case 'skillTree':
                if (!window.skillTree) {
                    window.skillTree = new SkillTree(game);
                }
                break;
            case 'achievements':
                if (!window.achievements) {
                    window.achievements = new Achievements(game);
                }
                break;
            case 'collection':
                if (!window.collection) {
                    window.collection = new Collection(game);
                }
                break;
            case 'customization':
                if (!window.customization) {
                    window.customization = new Customization(game);
                }
                break;
            case 'social':
                if (!window.social) {
                    window.social = new Social(game);
                }
                break;
            case 'settings':
                if (!window.settings) {
                    window.settings = new Settings(game);
                }
                break;
        }
    }
}