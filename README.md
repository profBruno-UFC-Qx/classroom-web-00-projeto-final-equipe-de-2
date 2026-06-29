[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/IDEzcQ6G)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=23905142)
# :checkered_flag: Gerenciamento de Oficina

O **Gerenciamento de Oficina** é uma solução digital desenvolvida para otimizar o fluxo de trabalho de centros automotivos. A aplicação permite o controle eficiente de agendamentos, ordens de serviço, manutenção de veículos e gestão de peças, promovendo uma comunicação transparente entre a oficina e os seus clientes.

## :technologist: Membros da equipe
André Alves de Freitas - 540683 - EC  
Pedro Nobrega Damacena - 536543 - EC

## :bulb: Objetivo Geral
Automatizar os processos administrativos e operacionais de uma oficina mecânica, permitindo o registo digital de manutenções, controlo de estoque e o acompanhamento de ordens de serviço em tempo real.

## :eyes: Público-Alvo
* **Proprietários e Gestores de Oficinas:** Que necessitam de uma ferramenta para organizar o fluxo de trabalho.
* **Mecânicos/Funcionários:** Que precisam consultar e atualizar o estado das reparações.
* **Clientes (Proprietários de Veículos):** Que desejam transparência no serviço e acesso ao histórico do veículo.

## :warning: Observação Acadêmica (Público-Alvo)

Diferente de projetos que visam cumprir horas de extensão, este sistema foi desenvolvido para fins puramente acadêmicos e técnicos dentro da disciplina. Como o nosso curso não exige obrigatoriamente a aplicação prática em uma comunidade externa (horas de extensão) para este projeto específico, o **cliente e os cenários descritos são fictícios**.

## :star2: Impacto Esperado
Espera-se uma redução no tempo de entrega dos veículos, maior precisão na gestão de peças e uma melhoria significativa na experiência do cliente, que passa a ter acesso digital ao progresso dos serviços contratados.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

* **Administrador:** Gestão total do sistema via painel do Strapi.
* **Funcionário (Mecânico):** Abertura, edição e remoção de Ordens de Serviço e Veículos.
* **Cliente:** Consulta dos seus veículos cadastrados e o estado atual das suas ordens de serviço.
* **Visitante:** Acesso às páginas públicas da oficina (home, contato, cadastro e login).

> Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outra funcionalidades restritas a certos tipos de usuários.

## :triangular_flag_on_post: Principais funcionalidades da aplicação

**Funcionalidades Públicas (acessíveis sem login):**
* Página inicial com apresentação da oficina e acesso ao sistema.
* Página de contato com endereço, telefone, horários e mapa (Google Maps).
* Cadastro de novo usuário (Cliente).
* Login com redirecionamento automático por perfil (Cliente ou Funcionário).

**Funcionalidades Restritas — Área do Cliente:**
* Dashboard com resumo de veículos e ordens de serviço.
* Listagem dos veículos e ordens de serviço vinculados ao cliente logado.

**Funcionalidades Restritas — Área do Funcionário:**
* Dashboard com totais de veículos, ordens de serviço e serviços em andamento.
* CRUD completo de Veículos (cadastrar, listar, editar e remover).
* CRUD completo de Ordens de Serviço (abrir, listar, editar status e remover).
* Vínculo automático entre OS e Veículo por placa.
* Vínculo automático entre Veículo e Cliente por CPF.

## :spiral_calendar: Entidades ou tabelas do sistema

* **Usuário:** Dados de perfil (username, email, senha, CPF, Telefone) com role (Cliente ou Funcionário).
* **Veículo (Car):** Marca, Modelo, Ano, Cor, Placa — vinculado a um Cliente.
* **Ordem de Serviço (Service):** Número da OS, Descrição, Status (em_espera / em_andamento / concluido), Data de Entrada, Data de Conclusão — vinculada a um Veículo.

----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**
* HTML5 semântico
* CSS3 com variáveis customizadas (tema dark)
* Bootstrap 5.3 (layout responsivo e componentes)
* Bootstrap Icons 1.10
* JavaScript (ES6+) — Fetch API, LocalStorage

**Backend:**
* Strapi 5 (Node.js)
* SQLite (banco de dados em desenvolvimento)
* Plugin users-permissions (autenticação JWT)

## :shipit: Operações implementadas para cada entidade da aplicação

| Entidade | Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Usuário (User) | ✅ | ✅ | ✅ | |
| Veículo (Car) | ✅ | ✅ | ✅ | ✅ |
| Ordem de Serviço (Service) | ✅ | ✅ | ✅ | ✅ |

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL | Descrição |
| --- | --- | --- |
| POST | `/api/auth/local/register` | Cadastro de novo usuário |
| POST | `/api/auth/local` | Login e geração do JWT |
| GET | `/api/users/me?populate=*` | Dados do usuário logado (com role) |
| PUT | `/api/users/:id` | Atualização de CPF e Telefone do usuário |
| GET | `/api/users?filters[CPF][$eq]=...` | Busca de cliente por CPF |
| GET | `/api/users/:id?populate=cars` | Veículos do cliente logado |
| GET | `/api/cars` | Listagem de todos os veículos |
| GET | `/api/cars/:documentId` | Dados de um veículo específico |
| GET | `/api/cars?filters[placa][$eqi]=...` | Busca de veículo por placa |
| POST | `/api/cars` | Cadastro de novo veículo |
| PUT | `/api/cars/:documentId` | Atualização de veículo |
| DELETE | `/api/cars/:documentId` | Remoção de veículo |
| GET | `/api/services?populate=car&sort=createdAt:desc` | Listagem de ordens de serviço |
| GET | `/api/services?filters[car][id][$in]=...&populate=car` | OSs filtradas por veículos do cliente |
| GET | `/api/services/:documentId?populate=car` | Dados de uma OS específica |
| POST | `/api/services` | Abertura de nova OS |
| PUT | `/api/services/:documentId` | Atualização de OS |
| DELETE | `/api/services/:documentId` | Remoção de OS |
