const API_URL = 'http://localhost:1337';

const jwt = localStorage.getItem('jwt');
const userRole = localStorage.getItem('userRole');

if (!jwt) window.location.href = './login.html';
if (userRole !== 'Funcionario') window.location.href = './index.html';

const params = new URLSearchParams(window.location.search);
const documentId = params.get('id');

if (!documentId) window.location.href = './ordens-servico.html';

const erroMsg = document.getElementById('erro-os');
const sucessoMsg = document.getElementById('sucesso-os');

async function carregarOS() {
    try {
        const response = await fetch(`${API_URL}/api/services/${documentId}?populate=car`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await response.json();
        const os = data.data;

        if (!response.ok || !os) {
            erroMsg.textContent = 'Ordem de serviço não encontrada.';
            erroMsg.style.display = 'block';
            return;
        }

        document.getElementById('numero-os').value = os.numero_os ?? '';
        document.getElementById('descricao').value = os.descricao ?? '';
        document.getElementById('estado').value = os.estado_atual ?? '';
        document.getElementById('data-entrada').value = os.data_entrada ?? '';
        document.getElementById('data-conclusao').value = os.data_conclusao ?? '';

        const carro = os.car;
        document.getElementById('veiculo').value = carro
            ? `${carro.marca} ${carro.modelo} ${carro.ano} — ${carro.placa}`
            : 'Veículo não vinculado';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao carregar os dados da OS.';
        erroMsg.style.display = 'block';
    }
}

document.getElementById('form-os').addEventListener('submit', async function (e) {
    e.preventDefault();

    erroMsg.style.display = 'none';
    sucessoMsg.style.display = 'none';

    const numeroOs    = document.getElementById('numero-os').value.trim();
    const descricao   = document.getElementById('descricao').value.trim();
    const estado      = document.getElementById('estado').value;
    const dataEntrada = document.getElementById('data-entrada').value;
    const dataConclusao = document.getElementById('data-conclusao').value;

    try {
        const response = await fetch(`${API_URL}/api/services/${documentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                data: {
                    numero_os: numeroOs,
                    descricao,
                    estado_atual: estado,
                    data_entrada: dataEntrada || null,
                    data_conclusao: dataConclusao || null
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error(err);
            erroMsg.textContent = 'Erro ao salvar alterações.';
            erroMsg.style.display = 'block';
            return;
        }

        localStorage.setItem('os_editada', 'true');
        window.location.href = './ordens-servico.html';

    } catch (err) {
        console.error(err);
        erroMsg.textContent = 'Erro ao conectar com o servidor.';
        erroMsg.style.display = 'block';
    }
});

carregarOS();