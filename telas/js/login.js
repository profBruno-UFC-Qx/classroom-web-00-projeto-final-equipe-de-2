const API_URL = 'http://localhost:1337';

const form = document.getElementById('form-login');
const erroMsg = document.getElementById('erro-login');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    erroMsg.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/api/auth/local?populate[role]=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: email, password: senha })
        });

        const data = await response.json();

        if (!response.ok) {
            erroMsg.textContent = 'E-mail ou senha incorretos.';
            erroMsg.style.display = 'block';
            return;
        }

        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.username);

        // Busca o role separadamente com o JWT recebido
        const meResponse = await fetch(`${API_URL}/api/users/me?populate=role`, {
            headers: { Authorization: `Bearer ${data.jwt}` }
        });
        const meData = await meResponse.json();

        const role = meData?.role?.name ?? 'Authenticated';
        localStorage.setItem('userRole', role);

        if (role === 'Funcionario') {
            window.location.href = './painel-funcionario.html';
        } else {
            window.location.href = './painel.html';
        }

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});