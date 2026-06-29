const API_URL = 'http://localhost:1337';

const jwt = localStorage.getItem('jwt');
const userRole = localStorage.getItem('userRole');
const userName = localStorage.getItem('userName');

if (!jwt) window.location.href = './login.html';
if (userRole !== 'Funcionario') window.location.href = './index.html';

document.getElementById('nome-usuario').textContent = userName ?? 'Funcionário';

async function carregarVeiculos() {
    try {
        const response = await fetch(`${API_URL}/api/cars`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await response.json();
        const todos = data.data ?? [];

        // Remove duplicatas pelo documentId
        const carros = todos.filter((c, i, self) =>
            i === self.findIndex(x => x.documentId === c.documentId)
        );

        document.getElementById('total-veiculos').textContent = carros.length;

        const lista = document.getElementById('lista-veiculos');
        lista.innerHTML = '';

        if (carros.length === 0) {
            lista.innerHTML = '<li class="item-veiculo"><p class="texto-suave">Nenhum veículo cadastrado.</p></li>';
        } else {
            carros.forEach((carro, index) => {
                const cores = ['var(--cor-primaria)', 'var(--cor-secundaria)'];
                const cor = cores[index % cores.length];
                const li = document.createElement('li');
                li.className = 'item-veiculo';
                li.innerHTML = `
                    <i class="bi bi-car-front-fill" style="font-size: 1.5rem; color: ${cor}; flex-shrink: 0;"></i>
                    <div style="flex: 1;">
                        <strong>${carro.marca} ${carro.modelo}</strong>
                        <p>${carro.ano} &mdash; ${carro.placa}</p>
                    </div>
                    <div class="acoes-veiculo">
                        <a href="editar-carro.html?id=${carro.documentId}" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <a href="#" title="Remover" onclick="removerCarro('${carro.documentId}', event)">
                            <i class="bi bi-trash"></i>
                        </a>
                    </div>
                `;
                lista.appendChild(li);
            });
        }

        await carregarServicos();

    } catch (err) {
        console.error('Erro ao carregar veículos:', err);
    }
}

async function removerCarro(documentId, event) {
    event.preventDefault();

    if (!confirm('Tem certeza que deseja remover este veículo?')) return;

    try {
        const response = await fetch(`${API_URL}/api/cars/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${jwt}` }
        });

        if (!response.ok) {
            alert('Erro ao remover veículo.');
            return;
        }

        carregarVeiculos();

    } catch (err) {
        console.error('Erro ao remover veículo:', err);
    }
}

async function carregarServicos() {
    try {
        const response = await fetch(`${API_URL}/api/services?populate=car&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await response.json();
        const servicos = data.data ?? [];

        document.getElementById('total-os').textContent = servicos.length;
        const emAndamento = servicos.filter(s => s.estado_atual === 'em_andamento').length;
        document.getElementById('total-andamento').textContent = emAndamento;

        const tbody = document.getElementById('tbody-os');
        tbody.innerHTML = '';

        if (servicos.length === 0) {
            tbody.innerHTML = '<tr class="linha-vazia"><td colspan="4" class="text-center py-3">Nenhuma ordem de serviço encontrada.</td></tr>';
            return;
        }

        const badgeMap = {
            em_espera:    '<span class="badge-status badge-espera">Em espera</span>',
            em_andamento: '<span class="badge-status badge-andamento">Em andamento</span>',
            concluido:    '<span class="badge-status badge-concluido">Concluído</span>',
        };

        servicos.forEach(s => {
            const carro = s.car;
            const nomeVeiculo = carro ? `${carro.marca} ${carro.modelo} ${carro.ano}` : '—';
            const badge = badgeMap[s.estado_atual] ?? s.estado_atual;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${String(s.id).padStart(4, '0')}</td>
                <td>${nomeVeiculo}</td>
                <td>${s.descricao}</td>
                <td>${badge}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Erro ao carregar serviços:', err);
    }
}

// Mensagem de sucesso ao cadastrar veículo
if (localStorage.getItem('veiculo_cadastrado')) {
    const msg = document.createElement('div');
    msg.textContent = 'Veículo cadastrado com sucesso!';
    msg.className = 'alerta-sucesso';
    document.querySelector('.secao-boas-vindas .container').appendChild(msg);
    localStorage.removeItem('veiculo_cadastrado');
    setTimeout(() => msg.remove(), 3000);
}

if (localStorage.getItem('veiculo_editado')) {
    const msg = document.createElement('div');
    msg.textContent = 'Veículo atualizado com sucesso!';
    msg.className = 'alerta-sucesso';
    document.querySelector('.secao-boas-vindas .container').appendChild(msg);
    localStorage.removeItem('veiculo_editado');
    setTimeout(() => msg.remove(), 3000);
}

carregarVeiculos();