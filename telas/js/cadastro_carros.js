const API_URL = 'http://localhost:1337';

// Redireciona se não estiver logado
const jwt = localStorage.getItem('jwt');
if (!jwt) window.location.href = './login.html';

const form = document.getElementById('form-carro');
const erroMsg = document.getElementById('erro-carro');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const marca  = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const ano    = parseInt(document.getElementById('ano').value);
    const cor    = document.getElementById('cor').value;
    const placa  = document.getElementById('placa').value;
    const userId = parseInt(localStorage.getItem('userId'));

    erroMsg.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/api/cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                data: {
                    marca,
                    modelo,
                    ano,
                    cor,
                    placa,
                    cliente: userId
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error(err);
            erroMsg.textContent = 'Erro ao cadastrar veículo. Tente novamente.';
            erroMsg.style.display = 'block';
            return;
        }

        window.location.href = './painel.html';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});