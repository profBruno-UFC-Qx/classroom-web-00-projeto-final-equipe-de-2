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
        const response = await fetch(`${API_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: senha,
                Telefone: telefone,
                CPF: cpf
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const mensagem = data?.error?.message || 'Erro ao realizar cadastro.';
            erroMsg.textContent = mensagem;
            erroMsg.style.display = 'block';
            return;
        }

        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.username);

        window.location.href = './painel.html';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});