const API_URL = 'http://localhost:1337';

const form = document.getElementById('form-cadastro');
const erroMsg = document.getElementById('erro-cadastro');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome      = document.getElementById('nome').value.trim();
    const email     = document.getElementById('email').value.trim();
    const cpf       = document.getElementById('cpf').value.trim();
    const telefone  = document.getElementById('telefone').value.trim();
    const senha     = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar-senha').value;

    erroMsg.style.display = 'none';

    if (senha !== confirmar) {
        erroMsg.textContent = 'As senhas não coincidem.';
        erroMsg.style.display = 'block';
        return;
    }

    if (senha.length < 6) {
        erroMsg.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        erroMsg.style.display = 'block';
        return;
    }

    try {
        // Etapa 1 — registra o usuário
        const response = await fetch(`${API_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: nome,
                email,
                password: senha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const mensagem = data?.error?.message ?? 'Erro ao realizar cadastro.';
            erroMsg.textContent = mensagem;
            erroMsg.style.display = 'block';
            return;
        }

        // Etapa 2 — atualiza CPF e Telefone
        await fetch(`${API_URL}/api/users/${data.user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.jwt}`
            },
            body: JSON.stringify({ CPF: cpf, Telefone: telefone })
        });
        
        localStorage.setItem('cadastro_sucesso', 'true');
        window.location.href = './login.html';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});