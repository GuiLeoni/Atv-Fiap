document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const gamesList = document.getElementById('games-list');
    const gameDetails = document.getElementById('game-details');
    const academyContents = document.getElementById('academy-contents');
    const userDetails = document.getElementById('user-details');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const errorMessage = document.getElementById('error-message');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerErrorMessage = document.getElementById('register-error-message');

    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const games = [
        { id: 1, title: 'Jogo 1', category: 'Ação', year: 2021 },
        { id: 2, title: 'Jogo 2', category: 'Aventura', year: 2020 },
    ];

    function renderGames(games) {
        gamesList.innerHTML = games.map(game => `
            <div class="game-item" data-id="${game.id}">
                <h3>${game.title}</h3>
                <p>Categoria: ${game.category}</p>
                <p>Ano: ${game.year}</p>
            </div>
        `).join('');
    }

    function renderGameDetails(gameId) {
        const game = games.find(g => g.id === parseInt(gameId));
        if (game) {
            gameDetails.innerHTML = `
                <h3>${game.title}</h3>
                <p>Categoria: ${game.category}</p>
                <p>Ano: ${game.year}</p>
                ${isLoggedIn ? `<button id="favorite-game">Favoritar</button>` : ''}
            `;
            if (isLoggedIn) {
                document.getElementById('favorite-game').addEventListener('click', () => {
                    let user = JSON.parse(localStorage.getItem('currentUser'));
                    user.favorites.push(game.id);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Jogo favoritado!');
                });
            }
        }
    }

    function renderAcademyContents() {
        academyContents.innerHTML = '<p>Conteúdos educativos e de conscientização sobre cibersegurança.</p>';
    }

    function renderUserProfile() {
        if (isLoggedIn) {
            let user = JSON.parse(localStorage.getItem('currentUser'));
            userDetails.innerHTML = `
                <h3>${user.name}</h3>
                <p>Jogos Favoritos: ${user.favorites.join(', ')}</p>
            `;
        } else {
            userDetails.innerHTML = '<p>Por favor, faça login para ver o perfil do usuário.</p>';
        }
    }

    function updateAuthButtons() {
        if (isLoggedIn) {
            loginButton.style.display = 'none';
            logoutButton.style.display = 'inline-block';
        } else {
            loginButton.style.display = 'inline-block';
            logoutButton.style.display = 'none';
        }
    }

    loginButton.addEventListener('click', function () {
        window.location.href = 'login.html';
    });

    logoutButton.addEventListener('click', function () {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('currentUser');
        isLoggedIn = false;
        updateAuthButtons();
        renderUserProfile();
        alert('Você foi deslogado.');
    });

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = 'Email ou senha inválidos.';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const fullName = document.getElementById('full-name').value;
            const dob = document.getElementById('dob').value;
            const gender = document.getElementById('gender').value;
            const country = document.getElementById('country').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(user => user.email === email)) {
                registerErrorMessage.textContent = 'Este email já está registrado.';
            } else {
                const newUser = {
                    name: fullName,
                    dob,
                    gender,
                    country,
                    phone,
                    email,
                    password,
                    favorites: [],
                    savedProducts: [],
                    reviews: []
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registro bem-sucedido! Faça login para continuar.');
                window.location.href = 'login.html';
            }
        });
    }
});