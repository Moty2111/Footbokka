class Social {
    constructor(game) {
        this.game = game;
        this.currentTab = 'friends';
        this.friends = [];
        this.leaderboard = [];
        this.clans = [];
        this.friendRequests = [];
        
        this.setupTabs();
        this.loadSocialData();
        this.renderCurrentTab();
        this.setupEventListeners();
    }

    setupTabs() {
        document.querySelectorAll('#socialSection .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentTab = btn.dataset.tab;
                this.renderCurrentTab();
            });
        });
    }

    setupEventListeners() {
        // Добавление друга
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-friend-btn')) {
                this.showAddFriendModal();
            }
        });

        // Принятие/отклонение заявки в друзья
        document.addEventListener('click', (e) => {
            if (e.target.closest('.accept-friend-btn')) {
                const friendId = e.target.closest('.accept-friend-btn').dataset.friendId;
                this.acceptFriendRequest(friendId);
            } else if (e.target.closest('.decline-friend-btn')) {
                const friendId = e.target.closest('.decline-friend-btn').dataset.friendId;
                this.declineFriendRequest(friendId);
            }
        });

        // Вступление в клан
        document.addEventListener('click', (e) => {
            if (e.target.closest('.join-clan-btn')) {
                const clanId = e.target.closest('.join-clan-btn').dataset.clanId;
                this.joinClan(clanId);
            }
        });
    }

    loadSocialData() {
        // Загрузка друзей (в реальной игре это было бы с сервера)
        this.friends = [
            { id: 1, name: 'Футболист01', avatar: 'fa-user-tie', online: true, level: 5, lastSeen: 'Сейчас' },
            { id: 2, name: 'GoalKing', avatar: 'fa-user-astronaut', online: false, level: 8, lastSeen: '2 часа назад' },
            { id: 3, name: 'Striker', avatar: 'fa-user-ninja', online: true, level: 12, lastSeen: 'Сейчас' }
        ];

        // Загрузка заявок в друзья
        this.friendRequests = [
            { id: 4, name: 'NewPlayer', avatar: 'fa-user-graduate', level: 3 }
        ];

        // Загрузка таблицы лидеров
        this.leaderboard = [
            { rank: 1, name: 'Champion', score: 50000, level: 25, avatar: 'fa-crown' },
            { rank: 2, name: 'ProPlayer', score: 35000, level: 20, avatar: 'fa-medal' },
            { rank: 3, name: 'Master', score: 25000, level: 18, avatar: 'fa-award' },
            { rank: 4, name: this.game.player.name, score: Math.floor(this.game.player.coins), level: this.game.player.level, avatar: this.game.player.avatar, isPlayer: true },
            { rank: 5, name: 'Rookie', score: 15000, level: 15, avatar: 'fa-user' }
        ];

        // Загрузка кланов
        this.clans = [
            { id: 1, name: 'Легенды', members: 25, level: 10, trophy: 'fa-trophy', description: 'Лучшие из лучших' },
            { id: 2, name: 'Чемпионы', members: 18, level: 8, trophy: 'fa-medal', description: 'Победители не сдаются' },
            { id: 3, name: 'Мастера', members: 12, level: 6, trophy: 'fa-award', description: 'Мастера своего дела' }
        ];
    }

    renderCurrentTab() {
        const container = document.getElementById('socialContent');
        
        switch(this.currentTab) {
            case 'friends':
                this.renderFriends(container);
                break;
            case 'leaderboard':
                this.renderLeaderboard(container);
                break;
            case 'clans':
                this.renderClans(container);
                break;
        }
    }

    renderFriends(container) {
        container.innerHTML = `
            <div class="tab-content" data-tab="friends">
                <div class="friends-header">
                    <h4>Ваши друзья</h4>
                    <button class="btn btn-primary btn-sm add-friend-btn">
                        <i class="fas fa-user-plus me-2"></i> Добавить друга
                    </button>
                </div>
                
                ${this.friendRequests.length > 0 ? `
                    <div class="friend-requests">
                        <h5>Заявки в друзья</h5>
                        <div class="requests-list">
                            ${this.friendRequests.map(request => `
                                <div class="friend-request">
                                    <div class="friend-avatar">
                                        <i class="fas ${request.avatar}"></i>
                                    </div>
                                    <div class="friend-info">
                                        <div class="friend-name">${request.name}</div>
                                        <div class="friend-level">Уровень ${request.level}</div>
                                    </div>
                                    <div class="friend-request-actions">
                                        <button class="btn btn-sm btn-success accept-friend-btn" data-friend-id="${request.id}">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger decline-friend-btn" data-friend-id="${request.id}">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="friends-list">
                    ${this.friends.map(friend => `
                        <div class="friend-card">
                            <div class="friend-avatar">
                                <i class="fas ${friend.avatar}"></i>
                                <div class="online-indicator ${friend.online ? 'online' : ''}"></div>
                            </div>
                            <div class="friend-name">${friend.name}</div>
                            <div class="friend-status">
                                ${friend.online ? 'В сети' : `Не в сети (${friend.lastSeen})`}
                            </div>
                            <div class="friend-level">Уровень ${friend.level}</div>
                            <div class="friend-actions">
                                <button class="btn btn-sm btn-outline-primary" title="Отправить подарок">
                                    <i class="fas fa-gift"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" title="Написать сообщение">
                                    <i class="fas fa-comment"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-success" title="Пригласить в игру">
                                    <i class="fas fa-gamepad"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderLeaderboard(container) {
        container.innerHTML = `
            <div class="tab-content" data-tab="leaderboard">
                <h4>Таблица лидеров</h4>
                <div class="leaderboard-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Место</th>
                                <th>Игрок</th>
                                <th>Очки</th>
                                <th>Уровень</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.leaderboard.map(player => `
                                <tr class="${player.isPlayer ? 'player-row' : ''}">
                                    <td class="rank-${player.rank <= 3 ? player.rank : ''}">
                                        #${player.rank}
                                    </td>
                                    <td>
                                        <div class="player-info">
                                            <i class="fas ${player.avatar}"></i>
                                            ${player.name}
                                            ${player.isPlayer ? '<span class="badge bg-primary ms-2">Вы</span>' : ''}
                                        </div>
                                    </td>
                                    <td>${player.score.toLocaleString()}</td>
                                    <td>${player.level}</td>
                                    <td>
                                        ${!player.isPlayer ? `
                                            <button class="btn btn-sm btn-outline-primary add-friend-btn">
                                                <i class="fas fa-user-plus"></i>
                                            </button>
                                        ` : '-'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderClans(container) {
        container.innerHTML = `
            <div class="tab-content" data-tab="clans">
                <div class="clans-header">
                    <h4>Кланы</h4>
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-plus me-2"></i> Создать клан
                    </button>
                </div>
                <div class="clans-list">
                    ${this.clans.map(clan => `
                        <div class="clan-card">
                            <div class="clan-info">
                                <div class="clan-icon">
                                    <i class="fas ${clan.trophy}"></i>
                                </div>
                                <div>
                                    <div class="clan-name">${clan.name}</div>
                                    <div class="clan-description">${clan.description}</div>
                                    <div class="clan-stats">
                                        Уровень ${clan.level} • ${clan.members} участников
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary btn-sm join-clan-btn" data-clan-id="${clan.id}">
                                Вступить
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showAddFriendModal() {
        const modal = document.createElement('div');
        modal.className = 'add-friend-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Добавить друга</h5>
                    <button type="button" class="btn-close" onclick="this.closest('.add-friend-modal').remove()"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="friendUsername" class="form-label">Имя пользователя</label>
                        <input type="text" class="form-control" id="friendUsername" placeholder="Введите имя друга">
                    </div>
                    <div class="friend-search-results">
                        <!-- Результаты поиска будут здесь -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.add-friend-modal').remove()">Отмена</button>
                    <button type="button" class="btn btn-primary" onclick="game.social.searchFriend()">Найти</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    searchFriend() {
        const username = document.getElementById('friendUsername').value.trim();
        if (!username) {
            window.ui.showNotification('Введите имя пользователя!', 'error');
            return;
        }

        // Имитация поиска
        const resultsContainer = document.querySelector('.friend-search-results');
        resultsContainer.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Поиск...</div>';

        setTimeout(() => {
            // Имитация найденного пользователя
            const foundUser = {
                id: Date.now(),
                name: username,
                avatar: 'fa-user',
                level: Math.floor(Math.random() * 20) + 1
            };

            resultsContainer.innerHTML = `
                <div class="search-result">
                    <div class="friend-avatar">
                        <i class="fas ${foundUser.avatar}"></i>
                    </div>
                    <div class="friend-info">
                        <div class="friend-name">${foundUser.name}</div>
                        <div class="friend-level">Уровень ${foundUser.level}</div>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="game.social.sendFriendRequest(${foundUser.id}, '${foundUser.name}')">
                        Отправить заявку
                    </button>
                </div>
            `;
        }, 1000);
    }

    sendFriendRequest(userId, userName) {
        // Имитация отправки заявки
        window.ui.showNotification(`Заявка отправлена пользователю ${userName}!`, 'success');
        document.querySelector('.add-friend-modal').remove();
    }

    acceptFriendRequest(friendId) {
        const request = this.friendRequests.find(r => r.id == friendId);
        if (request) {
            // Добавление в друзья
            this.friends.push({
                ...request,
                online: false,
                lastSeen: 'Только что'
            });
            
            // Удаление заявки
            this.friendRequests = this.friendRequests.filter(r => r.id != friendId);
            
            this.renderCurrentTab();
            window.ui.showNotification(`${request.name} теперь ваш друг!`, 'success');
        }
    }

    declineFriendRequest(friendId) {
        this.friendRequests = this.friendRequests.filter(r => r.id != friendId);
        this.renderCurrentTab();
        window.ui.showNotification('Заявка отклонена', 'info');
    }

    joinClan(clanId) {
        const clan = this.clans.find(c => c.id == clanId);
        if (clan) {
            window.ui.showNotification(`Вы подали заявку в клан "${clan.name}"!`, 'success');
        }
    }
}