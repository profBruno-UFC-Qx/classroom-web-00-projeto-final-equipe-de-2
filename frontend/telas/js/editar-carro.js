const API_URL = 'http://localhost:1337';

const jwt = localStorage.getItem('jwt');
const userRole = localStorage.getItem('userRole');

if (!jwt) window.location.href = './login.html';
if (userRole !== 'Funcionario') window.location.href = './index.html';

// Pega o documentId da URL
const params = new URLSearchParams(window.location.search);
const documentId = params.get('id');

if (!documentId) window.location.href = './index_funcionario.html';

const form = document.getElementById('form-editar-carro');
const erroMsg = document.getElementById('erro-carro');

// Carrega os dados atuais do carro
async function carregarCarro() {
    try {
        const response = await fetch(`${API_URL}/api/cars/${documentId}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await response.json();
        const carro = data.data;

        document.getElementById('marca').value  = carro.marca;
        document.getElementById('modelo').value = carro.modelo;
        document.getElementById('ano').value    = carro.ano;
        document.getElementById('cor').value    = carro.cor;
        document.getElementById('placa').value  = carro.placa;

    } catch (err) {
        console.error('Erro ao carregar carro:', err);
    }
}

// Salva as alterações
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const marca  = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const ano    = parseInt(document.getElementById('ano').value);
    const cor    = document.getElementById('cor').value;
    const placa  = document.getElementById('placa').value;

    erroMsg.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/api/cars/${documentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({ data: { marca, modelo, ano, cor, placa } })
        });

        if (!response.ok) {
            erroMsg.textContent = 'Erro ao salvar alterações. Tente novamente.';
            erroMsg.style.display = 'block';
            return;
        }

        localStorage.setItem('veiculo_editado', 'true');
        window.location.href = './index_funcionario.html';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});

carregarCarro();