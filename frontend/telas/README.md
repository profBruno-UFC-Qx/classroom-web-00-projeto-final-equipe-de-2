# Nóbrega Auto Center — Documentação do Frontend

Sistema web de gerenciamento de uma oficina mecânica. Desenvolvido com HTML, CSS (Bootstrap 5) e JavaScript vanilla, integrado ao backend Strapi v5 via API REST com autenticação JWT.

---

## Tecnologias utilizadas

- **HTML5** — estrutura semântica das páginas
- **CSS3 + Bootstrap 5.3** — estilização e responsividade
- **Bootstrap Icons 1.10** — ícones
- **JavaScript (ES6+)** — lógica e integração com a API
- **Strapi v5** — backend (rodando em `http://localhost:1337`)
- **JWT** — autenticação e controle de acesso

---

## Estrutura de arquivos

```
telas/
├── css/
│   ├── layout.css              # Estilos globais e variáveis CSS
│   ├── layout_principal.css    # Estilos do painel (tabelas, métricas, badges)
│   ├── layout_contato.css      # Estilos da página de contato
│   └── layout_home.css         # Estilos da página inicial pública
├── js/
│   ├── login.js                # Autenticação
│   ├── cadastro.js             # Registro de usuário
│   ├── cadastro_carros.js      # Cadastro de veículo (funcionário)
│   ├── cadastro-os.js          # Cadastro de ordem de serviço (funcionário)
│   ├── editar-carro.js         # Edição de veículo (funcionário)
│   ├── ordens-servico.js       # Listagem de OSs (funcionário)
│   ├── index.js                # Painel do cliente
│   └── index_funcionario.js    # Painel do funcionário
├── img/
│   └── image.png               # Favicon
├── home.html                   # Página inicial pública
├── login.html                  # Login
├── cadastro.html               # Cadastro de usuário
├── contato.html                # Contato e localização
├── index.html                  # Painel do cliente
├── index_funcionario.html      # Painel do funcionário
├── cadastro_carros.html        # Cadastro de veículo
├── cadastro-os.html            # Nova ordem de serviço
├── editar-carro.html           # Edição de veículo
└── ordens-servico.html         # Listagem de ordens de serviço
```

---

## Papéis de usuário (Roles)

| Role | Acesso |
|---|---|
| **Public** | `home.html`, `login.html`, `cadastro.html`, `contato.html` |
| **Cliente** (Authenticated) | `index.html` — visualiza seus veículos e OSs |
| **Funcionario** | `index_funcionario.html`, `ordens-servico.html`, `cadastro_carros.html`, `cadastro-os.html`, `editar-carro.html` |

O redirecionamento após login é feito automaticamente com base no role salvo no `localStorage`.

---

## Autenticação

O JWT e os dados do usuário são salvos no `localStorage` após o login:

```
localStorage.jwt         → token de autenticação
localStorage.userId      → ID do usuário
localStorage.userName    → nome do usuário
localStorage.userRole    → role ('Cliente' ou 'Funcionario')
```

Todas as páginas protegidas verificam o JWT no início do JS e redirecionam para `login.html` se ausente.

---

## Telas

### `home.html` — Página Inicial Pública

Página de apresentação da oficina, acessível a qualquer visitante sem necessidade de login.

- Exibe hero section com botões para **Criar conta** e **Já tenho conta**
- Área pública, sem integração com a API
- CSS exclusivo: `layout_home.css`

---

### `login.html` + `js/login.js` — Login

Tela de autenticação do sistema.

**Fluxo:**
1. Usuário informa e-mail e senha
2. POST em `/api/auth/local`
3. JWT e dados do usuário salvos no `localStorage`
4. GET em `/api/users/{id}?populate=role` para identificar o role
5. Redirecionamento:
   - `Funcionario` → `index_funcionario.html`
   - `Cliente` → `index.html`

**Funcionalidade extra:** exibe mensagem de sucesso verde caso venha de um cadastro recém-concluído (via flag `cadastro_sucesso` no localStorage).

---

### `cadastro.html` + `js/cadastro.js` — Cadastro de Usuário

Registro de novos clientes no sistema. Acessível publicamente.

**Campos:** Nome completo, E-mail, CPF, Telefone, Senha, Confirmar senha

**Fluxo (duas etapas):**
1. POST em `/api/auth/local/register` com `username`, `email` e `password`
2. PUT em `/api/users/{id}` com `CPF` e `Telefone` (campos extras não aceitos no register diretamente)

**Validações:**
- Senhas devem coincidir
- Senha mínima de 6 caracteres

Após o cadastro, redireciona para `login.html` com mensagem de sucesso.

---

### `contato.html` — Contato e Localização

Página pública com informações da oficina.

- Endereço, telefone e e-mail
- Horário de funcionamento (Seg–Sex 08h–18h, Sáb 08h–13h, Dom fechado)
- Placeholder para integração futura com Google Maps
- CSS exclusivo: `layout_contato.css`
- Sem integração com a API

---

### `index.html` + `js/index.js` — Painel do Cliente

Área restrita do cliente. Exige login com role `Cliente`.

**Dados exibidos:**
- Métricas: total de veículos, total de OSs e OSs em andamento
- Lista de veículos do cliente (populada via `/api/users/{id}?populate=cars`)
- Tabela de ordens de serviço filtradas pelos IDs dos veículos do cliente

**Proteção de rota:** redireciona para `login.html` se não houver JWT.

**Detalhe técnico:** os veículos são buscados pelo lado do User (não do Car) para contornar limitações de filtro do Strapi v5 em relações com `users-permissions`. Duplicatas são removidas pelo `documentId`.

---

### `index_funcionario.html` + `js/index_funcionario.js` — Painel do Funcionário

Área restrita do funcionário. Exige role `Funcionario`.

**Dados exibidos:**
- Métricas: total de veículos, total de OSs e OSs em andamento
- Lista de **todos** os veículos cadastrados na oficina com botões de editar e remover
- Tabela de todas as ordens de serviço

**Funcionalidades:**
- **Editar veículo** → redireciona para `editar-carro.html?id={documentId}`
- **Remover veículo** → confirmação via `confirm()` + DELETE em `/api/cars/{documentId}`
- Mensagens de sucesso ao retornar de cadastro ou edição de veículo

---

### `cadastro_carros.html` + `js/cadastro_carros.js` — Cadastro de Veículo

Exclusivo para funcionários. Cadastra um veículo vinculado a um cliente.

**Campos:** CPF do cliente, Marca, Modelo, Ano, Cor, Placa

**Fluxo (duas etapas):**
1. GET em `/api/users?filters[CPF][$eq]={cpf}` para buscar o cliente
2. Se encontrado, POST em `/api/cars` vinculando o veículo ao cliente via campo `cliente`
3. Se não encontrado, exibe erro "Cliente não encontrado"

Após o cadastro, redireciona para `index_funcionario.html` com mensagem de sucesso.

---

### `editar-carro.html` + `js/editar-carro.js` — Editar Veículo

Exclusivo para funcionários. Recebe o `documentId` do carro via query string (`?id=...`).

**Fluxo:**
1. GET em `/api/cars/{documentId}` para pré-preencher os campos
2. PUT em `/api/cars/{documentId}` com os dados atualizados ao submeter

Após salvar, redireciona para `index_funcionario.html` com mensagem de sucesso.

---

### `ordens-servico.html` + `js/ordens-servico.js` — Listagem de OSs

Exclusivo para funcionários. Lista todas as ordens de serviço da oficina.

**Dados exibidos:** Nº OS, Veículo, Descrição, Data de entrada, Status (badge colorido), botão de editar

**Integração:** GET em `/api/services?populate=car&sort=createdAt:desc`

Botão **Nova OS** redireciona para `cadastro-os.html`.

---

### `cadastro-os.html` + `js/cadastro-os.js` — Nova Ordem de Serviço

Exclusivo para funcionários. Cria uma nova OS vinculada a um veículo.

**Campos:** Placa do veículo, Número da OS, Descrição, Status, Data de entrada, Data de conclusão

**Fluxo (duas etapas):**
1. GET em `/api/cars?filters[placa][$eqi]={placa}` para buscar o veículo pela placa (case-insensitive)
2. POST em `/api/services` vinculando ao carro encontrado

Após cadastro, redireciona para `ordens-servico.html` com mensagem de sucesso.

---

## Endpoints utilizados

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/auth/local` | Login |
| POST | `/api/auth/local/register` | Cadastro de usuário |
| GET | `/api/users/{id}?populate=role` | Buscar role do usuário |
| GET | `/api/users/{id}?populate=cars` | Buscar veículos do cliente |
| PUT | `/api/users/{id}` | Atualizar CPF e Telefone |
| GET | `/api/users?filters[CPF][$eq]=...` | Buscar cliente por CPF |
| GET | `/api/cars` | Listar todos os carros (funcionário) |
| GET | `/api/cars/{documentId}` | Buscar carro por ID |
| GET | `/api/cars?filters[placa][$eqi]=...` | Buscar carro por placa |
| POST | `/api/cars` | Cadastrar veículo |
| PUT | `/api/cars/{documentId}` | Editar veículo |
| DELETE | `/api/cars/{documentId}` | Remover veículo |
| GET | `/api/services?populate=car` | Listar OSs |
| POST | `/api/services` | Criar OS |

---

## Como executar

1. Inicie o Strapi: `npm run develop` (porta 1337)
2. Sirva o frontend com Live Server no VS Code ou similar
3. Acesse `http://127.0.0.1:5500/home.html`

> O CORS do Strapi deve estar configurado para aceitar `http://127.0.0.1:5500` em `config/middlewares.js`.