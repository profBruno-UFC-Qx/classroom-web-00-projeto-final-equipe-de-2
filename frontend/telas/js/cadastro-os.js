const API_URL = 'http://localhost:1337';

const jwt = localStorage.getItem('jwt');
const userRole = localStorage.getItem('userRole');

// Bloqueia quem não for funcionário
if (!jwt) window.location.href = './login.html';
if (userRole !== 'Funcionario') window.location.href = './index.html';

const form = document.getElementById('form-os');
const erroMsg = document.getElementById('erro-os');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    erroMsg.style.display = 'none';

    // Captura os dados do formulário
    const placa = document.getElementById('placa-carro').value.trim();
    const numeroOs = document.getElementById('numero-os').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const estado = document.getElementById('estado').value;
    const dataEntrada = document.getElementById('data-entrada').value;
    const dataConclusao = document.getElementById('data-conclusao').value;

    try {
        // PASSO 1: Buscar o ID do carro pela placa
        const carResponse = await fetch(`${API_URL}/api/cars?filters[placa][$eqi]=${placa}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const carData = await carResponse.json();

        // Se a requisição falhar ou retornar uma lista vazia, o carro não existe
        if (!carResponse.ok || carData.data.length === 0) {
            erroMsg.textContent = 'Veículo não encontrado. Verifique a placa informada.';
            erroMsg.style.display = 'block';
            return;
        }

        const carroId = carData.data[0].id; // Pega o ID numérico do carro encontrado

        // PASSO 2: Criar a Ordem de Serviço vinculada ao ID do carro
        const osResponse = await fetch(`${API_URL}/api/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                data: {
                    numero_os: numeroOs,
                    descricao: descricao,
                    estado_atual: estado,
                    data_entrada: dataEntrada || null,
                    data_conclusao: dataConclusao || null,
                    car: carroId // Vinculando a OS ao carro
                }
            })
        });

        if (!osResponse.ok) {
            const err = await osResponse.json();
            console.error("Erro do Strapi:", err);
            erroMsg.textContent = 'Erro ao cadastrar OS. Verifique os dados.';
            erroMsg.style.display = 'block';
            return;
        }

        // Sucesso: Ativa a mensagem e redireciona para a lista
        localStorage.setItem('os_cadastrada', 'true');
        window.location.href = './ordens-servico.html';

    } catch (err) {
        console.error('Erro na requisição:', err);
        erroMsg.textContent = 'Erro de conexão com o servidor.';
        erroMsg.style.display = 'block';
    }
});