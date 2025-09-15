# 🎨 VB Art Shop: Uma Experiência de E-commerce Completa

![VB Art Shop Home](/frontend/public/Captura%20Tela%20Home.png)

## ✨ Sobre o Projeto

O **VB Art Shop** é uma aplicação web de e-commerce construída com foco em arte. Ele foi projetado para demonstrar um fluxo de compra completo, desde a autenticação de usuários até a finalização do pedido. O projeto é uma prova de conceito de como integrar um frontend React com um backend Express e um banco de dados PostgreSQL.

## 🚀 Funcionalidades Principais

* **Autenticação de Usuário:** Sistema completo de login, cadastro e autenticação segura.
* **Carrinho de Compras Persistente:** O estado do carrinho é mantido e salvo localmente, mesmo após o usuário fechar a página.
* **Vitrine de Produtos Dinâmica:** Produtos são buscados e exibidos diretamente do banco de dados do backend.
* **Processo de Checkout:** Um fluxo claro para finalizar a compra e persistir o pedido no banco de dados.
* **Histórico de Pedidos:** Acompanhe todos os pedidos anteriores de um usuário, mostrando os itens e o valor total.

![VB Art Shop Cart](/frontend/public/Captura%20de%20tela%20%20Cart.png)

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React:** Para a interface de usuário.
* **React Context API:** Gerenciamento de estado global.
* **React Router DOM:** Gerenciamento de rotas.
* **JavaScript (ES6+):** Lógica principal.
* **CSS:** Estilização.

### Backend
* **Node.js:** Ambiente de execução.
* **Express.js:** Framework para a API RESTful.
* **PostgreSQL:** Banco de dados relacional.
* **`pg`:** Driver Node.js para PostgreSQL.

---

## 💻 Como Rodar a Aplicação

Siga estes passos para ter o projeto rodando em sua máquina local.

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **PostgreSQL** instalados.

### 1. Clonar o Repositório

```bash
git clone [https://github.com/VBDeveloping/VB_Art_App.git](https://github.com/VBDeveloping/VB_Art_App.git)
cd VB_Art_App

### 2. Configurar o Banco de Dados

Crie um banco de dados vazio no PostgreSQL e execute os scripts SQL para criar as tabelas necessárias: users, products, orders, order_items, etc.


### 3. Configurar as Variáveis de Ambiente
Na pasta raiz do projeto, crie um arquivo chamado .env e adicione as suas credenciais do banco de dados:

DB_USER=seu_usuario
DB_HOST=seu_host_do_banco
DB_DATABASE=seu_banco_de_dados
DB_PASSWORD=sua_senha
DB_PORT=5432

### 4. Instalar Dependências e Iniciar
Abra dois terminais na pasta raiz do projeto, um para backend e outro para frontend.

A aplicação web estará disponível em http://localhost:3000.