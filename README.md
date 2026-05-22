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

* **Administrador:** Gestão total do sistema, incluindo relatórios financeiros e gestão de utilizadores.
* **Funcionário (Mecânico):** Responsável pela atualização técnica das Ordens de Serviço (OS) e consulta de peças.
* **Cliente:** Consulta os seus veículos cadastrados e o estado atual das suas ordens de serviço.
* **Visitante:** Acesso a informações básicas da oficina, como serviços prestados, localização e contacto.
> Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outra funcionalidades restritas a certos tipos de usuários.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

**Funcionalidades Públicas:**
* Consulta de catálogo de serviços (Troca de óleo, travões, etc.).
* Página de contacto e localização.
* Registo de novo utilizador (Cliente).

**Funcionalidades Restritas:**
* **Área do Cliente:** Registo de veículos (Matrícula/Modelo) e consulta de orçamentos.
* **Área do Funcionário:** Abertura e edição de Ordens de Serviço (OS) e atualização de estado (Em Espera, Em Reparação, Concluído).
* **Gestão de Stock:** Controlo de entrada e saída de peças (Apenas Admin/Funcionário autorizado).
## :spiral_calendar: Entidades ou tabelas do sistema

* **Usuário:** Dados de perfil (Admin, Funcionário, Cliente).
* **Veículo:** Informações dos automóveis (Matrícula, Marca, Modelo, Ano).
* **Ordem de Serviço (OS):** Regista o problema, mecânico atribuído, data de entrada e estado.
* **Peça/Serviço:** Catálogo de componentes e mão-de-obra com valores unitários.

----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.

**Backend:**

Lista as tecnologias, frameworks e bibliotecas utilizados.


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Entidade 1 | X |  X  |  | X |
| Entidade 2 | X |    |  X | X |
| Entidade 3 | X |    |  |  |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | api/entidade1/|
| POST | api/entidade2 |
