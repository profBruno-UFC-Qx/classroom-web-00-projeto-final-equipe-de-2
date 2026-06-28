const API_URL = 'http://localhost:1337';

const jwt = localStorage.getItem('jwt');
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');

if (!jwt) window.location.href = './login.html';

document.getElementById('nome-usuario').textContent = userName ?? 'Usuário';

async function carregarVeiculos() {
    try {
        const response = await fetch(`${API_URL}/api/users/${userId}?populate=cars`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await response.json();

        const todosCarros = data.cars ?? [];

        // Remove duplicatas pelo documentId
        const carros = todosCarros.filter((c, index, self) =>
            index === self.findIndex(x => x.documentId === c.documentId)
        );

        document.getElementById('total-veiculos').textContent = carros.length;

        const lista = document.getElementById('lista-veiculos');
        lista.innerHTML = '';

        if (carros.length === 0) {
            lista.innerHTML = '<li class="item-veiculo"><p class="texto-suave">Nenhum veículo cadastrado.</p></li>';
        } else {
            const cores = ['var(--cor-primaria)', 'var(--cor-secundaria)'];
            carros.forEach((carro, index) => {
                const cor = cores[index % cores.length];
                const li = document.createElement('li');
                li.className = 'item-veiculo';
                li.innerHTML = `
                    <i class="bi bi-car-front-fill" style="font-size: 1.5rem; color: ${cor}; flex-shrink: 0;"></i>
                    <div>
                        <strong>${carro.marca} ${carro.modelo}</strong>
                        <p>${carro.ano} &mdash; ${carro.placa}</p>
                    </div>
                `;
                lista.appendChild(li);
            });
        }

        // Passa os carros para carregar os serviços
        await carregarServicos(carros);

    } catch (err) {
        console.error('Erro ao carregar veículos:', err);
    }
}

async function carregarServicos(carros) {
    try {
        if (carros.length === 0) {
            document.getElementById('total-os').textContent = '0';
            document.getElementById('total-andamento').textContent = '0';
            document.getElementById('tbody-os').innerHTML = '<tr class="linha-vazia"><td colspan="4" class="text-center py-3">Nenhuma ordem de serviço encontrada.</td></tr>';
            return;
        }

        const ids = carros.map(c => c.id);
        const query = ids.map(id => `filters[car][id][$in]=${id}`).join('&');

        const response = await fetch(`${API_URL}/api/services?${query}&populate=car`, {
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

carregarVeiculos();