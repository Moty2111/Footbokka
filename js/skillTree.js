class SkillTree {
    constructor(game) {
        this.game = game;
        this.skills = [];
        this.skillPoints = 0;
        this.loadSkillTree();
        this.renderSkillTree();
        this.updateSkillPoints();
    }

    loadSkillTree() {
        // Загрузка дерева навыков
        fetch('data/skillTree.json')
            .then(response => response.json())
            .then(data => {
                this.skills = data.skills;
                this.renderSkillTree();
            })
            .catch(error => {
                console.error('Error loading skill tree:', error);
                // Использование дерева по умолчанию
                this.skills = [
                    {
                        id: 'power_1',
                        name: 'Сила I',
                        description: '+2 к силе клика',
                        icon: 'fa-fist-raised',
                        x: 200,
                        y: 100,
                        cost: 1,
                        unlocked: false,
                        dependencies: []
                    },
                    {
                        id: 'power_2',
                        name: 'Сила II',
                        description: '+5 к силе клика',
                        icon: 'fa-fist-raised',
                        x: 400,
                        y: 100,
                        cost: 2,
                        unlocked: false,
                        dependencies: ['power_1']
                    },
                    {
                        id: 'income_1',
                        name: 'Доход I',
                        description: '+1 к доходу/сек',
                        icon: 'fa-coins',
                        x: 200,
                        y: 300,
                        cost: 1,
                        unlocked: false,
                        dependencies: []
                    },
                    {
                        id: 'income_2',
                        name: 'Доход II',
                        description: '+3 к доходу/сек',
                        icon: 'fa-coins',
                        x: 400,
                        y: 300,
                        cost: 2,
                        unlocked: false,
                        dependencies: ['income_1']
                    },
                    {
                        id: 'master',
                        name: 'Мастер',
                        description: '+10 ко всему',
                        icon: 'fa-star',
                        x: 300,
                        y: 200,
                        cost: 5,
                        unlocked: false,
                        dependencies: ['power_2', 'income_2']
                    }
                ];
                this.renderSkillTree();
            });

        // Загрузка прогресса
        const savedProgress = localStorage.getItem('footballClickerSkillTree');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.skillPoints = progress.skillPoints || 0;
            
            if (this.skills.length > 0) {
                this.skills.forEach(skill => {
                    const saved = progress.skills?.find(s => s.id === skill.id);
                    if (saved) {
                        skill.unlocked = saved.unlocked;
                    }
                });
            }
        }
    }

    saveProgress() {
        const progress = {
            skillPoints: this.skillPoints,
            skills: this.skills.map(s => ({
                id: s.id,
                unlocked: s.unlocked
            }))
        };
        localStorage.setItem('footballClickerSkillTree', JSON.stringify(progress));
    }

    renderSkillTree() {
        const container = document.getElementById('skillTreeContent');
        container.innerHTML = '';

        if (this.skills.length === 0) {
            container.innerHTML = '<p class="text-center">Загрузка дерева навыков...</p>';
            return;
        }

        // Отрисовка связей
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '1';

        this.skills.forEach(skill => {
            skill.dependencies.forEach(depId => {
                const depSkill = this.skills.find(s => s.id === depId);
                if (depSkill) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', depSkill.x);
                    line.setAttribute('y1', depSkill.y);
                    line.setAttribute('x2', skill.x);
                    line.setAttribute('y2', skill.y);
                    line.setAttribute('stroke', skill.unlocked ? '#00ff88' : '#444');
                    line.setAttribute('stroke-width', '3');
                    svg.appendChild(line);
                }
            });
        });

        container.appendChild(svg);

        // Отрисовка узлов (увеличенных)
        this.skills.forEach(skill => {
            const node = document.createElement('div');
            node.className = `skill-node ${skill.unlocked ? 'unlocked' : ''}`;
            node.style.left = `${skill.x - 60}px`;
            node.style.top = `${skill.y - 60}px`;
            node.style.width = '120px';
            node.style.height = '120px';
            node.style.zIndex = '2';
            node.innerHTML = `
                <div class="skill-icon">
                    <i class="fas ${skill.icon}"></i>
                </div>
                <div class="skill-name">${skill.name}</div>
                <div class="skill-cost">${skill.cost} оч.</div>
                <div class="skill-tooltip">
                    <div class="skill-description">${skill.description}</div>
                    ${skill.dependencies.length > 0 ? `
                        <div class="skill-dependencies">
                            Требуется: ${skill.dependencies.map(depId => {
                                const depSkill = this.skills.find(s => s.id === depId);
                                return depSkill ? depSkill.name : '';
                            }).join(', ')}
                        </div>
                    ` : ''}
                </div>
            `;
            
            node.addEventListener('click', () => {
                this.unlockSkill(skill);
            });

            container.appendChild(node);
        });
    }

    unlockSkill(skill) {
        if (skill.unlocked) return;

        // Проверка очков
        if (this.skillPoints < skill.cost) {
            window.ui.showNotification('Недостаточно очков навыков!', 'error');
            return;
        }

        // Проверка зависимостей
        const canUnlock = skill.dependencies.every(depId => {
            const depSkill = this.skills.find(s => s.id === depId);
            return depSkill && depSkill.unlocked;
        });

        if (!canUnlock) {
            window.ui.showNotification('Сначала разблокируйте предыдущие навыки!', 'warning');
            return;
        }

        // Разблокировка навыка
        skill.unlocked = true;
        this.skillPoints -= skill.cost;
        this.saveProgress();
        this.renderSkillTree();
        this.updateSkillPoints();
        this.applySkillEffects(skill);
        
        window.ui.showNotification(`Навык "${skill.name}" разблокирован!`, 'success');
    }

    applySkillEffects(skill) {
        // Применение эффектов навыка
        if (skill.id.includes('power')) {
            this.game.player.clickPower += parseInt(skill.description.match(/\+(\d+)/)[1]);
        } else if (skill.id.includes('income')) {
            this.game.player.incomePerSec += parseInt(skill.description.match(/\+(\d+)/)[1]);
        } else if (skill.id === 'master') {
            this.game.player.clickPower += 10;
            this.game.player.incomePerSec += 10;
        }
        
        this.game.player.updateUI();
    }

    updateSkillPoints() {
        document.getElementById('skillPoints').textContent = this.skillPoints;
    }

    addSkillPoints(amount) {
        this.skillPoints += amount;
        this.updateSkillPoints();
        this.saveProgress();
    }
}