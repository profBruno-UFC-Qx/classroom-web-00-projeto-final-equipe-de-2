const API_URL = 'http://localhost:1337';

const form = document.getElementById('form-cadastro');
const erroMsg = document.getElementById('erro-cadastro');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    erroMsg.style.display = 'none';

    if (senha !== confirmarSenha) {
        erroMsg.textContent = 'As senhas não coincidem.';
        erroMsg.style.display = 'block';
        return;
    }

    try {
        const registerResponse = await fetch(`${API_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password: senha })
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
            const mensagem = registerData?.error?.message || 'Erro ao realizar cadastro.';
            erroMsg.textContent = mensagem;
            erroMsg.style.display = 'block';
            return;
        }

        const jwt = registerData.jwt;
        const userId = registerData.user.id;

        await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({ Telefone: telefone, CPF: cpf })
        });

        localStorage.setItem('jwt', jwt);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', registerData.user.username);

        window.location.href = './index.html';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});