const API_URL = 'http://localhost:1337';

const form = document.getElementById('form-login');
const erroMsg = document.getElementById('erro-login');

if (localStorage.getItem('cadastro_sucesso')) {
    const msg = document.getElementById('erro-login');
    msg.textContent = 'Cadastro realizado com sucesso! Faça login.';
    msg.style.color = '#4caf87';
    msg.style.display = 'block';
    localStorage.removeItem('cadastro_sucesso');
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    erroMsg.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/api/auth/local`, {
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

        // SOLUÇÃO: Usar o endpoint /users/me em vez de /users/:id
        const meResponse = await fetch(`${API_URL}/api/users/me?populate=*`, {
            headers: { Authorization: `Bearer ${data.jwt}` }
        });
        const meData = await meResponse.json();
        
        // Validação adicionada para evitar que erros 403 passem despercebidos
        if (!meResponse.ok) {
            console.error('Erro na requisição /me:', meData);
            erroMsg.textContent = 'Erro ao verificar permissões do usuário.';
            erroMsg.style.display = 'block';
            return;
        }

        console.log('meData completo:', meData);

        const role = meData?.role?.name ?? 'Cliente';
        localStorage.setItem('userRole', role);

        if (role === 'Funcionario') {
            window.location.href = './index_funcionario.html';
        } else {
            window.location.href = './index.html';
        }

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});