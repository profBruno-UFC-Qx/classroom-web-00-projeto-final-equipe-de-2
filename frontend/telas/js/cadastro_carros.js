const API_URL = 'http://localhost:1337';

const jwt = localStorage.getItem('jwt');
const userRole = localStorage.getItem('userRole');

if (!jwt) window.location.href = './login.html';
if (userRole !== 'Funcionario') window.location.href = './index.html';

const form = document.getElementById('form-carro');
const erroMsg = document.getElementById('erro-carro');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const cpfCliente = document.getElementById('cpf-cliente').value.trim();
    const marca  = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const ano    = parseInt(document.getElementById('ano').value);
    const cor    = document.getElementById('cor').value;
    const placa  = document.getElementById('placa').value;

    erroMsg.style.display = 'none';

    try {
        // Etapa 1 — busca o cliente pelo CPF
        const buscaResponse = await fetch(`${API_URL}/api/users?filters[CPF][$eq]=${cpfCliente}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const usuarios = await buscaResponse.json();

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            erroMsg.textContent = 'Cliente não encontrado. Verifique o CPF informado.';
            erroMsg.style.display = 'block';
            return;
        }

        const clienteId = usuarios[0].id;

        // Etapa 2 — cadastra o carro vinculado ao cliente
        const response = await fetch(`${API_URL}/api/cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                data: { marca, modelo, ano, cor, placa, cliente: clienteId }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error(err);
            erroMsg.textContent = 'Erro ao cadastrar veículo. Tente novamente.';
            erroMsg.style.display = 'block';
            return;
        }

        localStorage.setItem('veiculo_cadastrado', 'true');
        window.location.href = './index_funcionario.html';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});