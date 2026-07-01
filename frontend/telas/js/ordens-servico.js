const API_URL = 'http://localhost:1337';

const jwt = localStorage.getItem('jwt');
const userRole = localStorage.getItem('userRole');

if (!jwt) window.location.href = './login.html';
if (userRole !== 'Funcionario') window.location.href = './index.html';

const badgeMap = {
    em_espera:    '<span class="badge-status badge-espera">Em espera</span>',
    em_andamento: '<span class="badge-status badge-andamento">Em andamento</span>',
    concluido:    '<span class="badge-status badge-concluido">Concluído</span>',
};

async function deletarOS(documentId) {
    if (!confirm('Tem certeza que deseja excluir esta ordem de serviço?')) return;

    try {
        const response = await fetch(`${API_URL}/api/services/${documentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${jwt}` }
        });

        if (!response.ok) {
            alert('Erro ao excluir a ordem de serviço.');
            return;
        }

        carregarOS();

    } catch (err) {
        console.error(err);
        alert('Erro ao conectar com o servidor.');
    }
}

async function carregarOS() {
    try {
        const response = await fetch(`${API_URL}/api/services?populate=car&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await response.json();
        const servicos = data.data ?? [];

        const tbody = document.getElementById('tbody-os');
        tbody.innerHTML = '';

        if (servicos.length === 0) {
            tbody.innerHTML = '<tr class="linha-vazia"><td colspan="6" class="text-center py-3">Nenhuma ordem de serviço encontrada.</td></tr>';
            return;
        }

        servicos.forEach(s => {
            const carro = s.car;
            const nomeVeiculo = carro ? `${carro.marca} ${carro.modelo} ${carro.ano}` : '—';
            const badge = badgeMap[s.estado_atual] ?? s.estado_atual;
            const dataEntrada = s.data_entrada ? new Date(s.data_entrada).toLocaleDateString('pt-BR') : '—';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${s.numero_os ?? String(s.id).padStart(4, '0')}</td>
                <td>${nomeVeiculo}</td>
                <td>${s.descricao}</td>
                <td>${dataEntrada}</td>
                <td>${badge}</td>
                <td style="white-space: nowrap;">
                    <a href="editar-os.html?id=${s.documentId}" class="texto-suave me-2" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </a>
                    <a href="#" class="texto-suave btn-deletar" data-id="${s.documentId}" title="Excluir">
                        <i class="bi bi-trash" style="color: var(--cor-primaria);"></i>
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-deletar').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                deletarOS(this.dataset.id);
            });
        });

    } catch (err) {
        console.error('Erro ao carregar OSs:', err);
    }
}

if (localStorage.getItem('os_cadastrada')) {
    const msg = document.createElement('div');
    msg.textContent = 'Ordem de serviço cadastrada com sucesso!';
    msg.className = 'alerta-sucesso';
    document.querySelector('.secao-boas-vindas .container').appendChild(msg);
    localStorage.removeItem('os_cadastrada');
    setTimeout(() => msg.remove(), 3000);
}

if (localStorage.getItem('os_editada')) {
    const msg = document.createElement('div');
    msg.textContent = 'Ordem de serviço atualizada com sucesso!';
    msg.className = 'alerta-sucesso';
    document.querySelector('.secao-boas-vindas .container').appendChild(msg);
    localStorage.removeItem('os_editada');
    setTimeout(() => msg.remove(), 3000);
}

carregarOS();