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

## Estrutura do projeto

## ⚙️ Backend (Node.js + Express + PostgreSQL)

O backend é responsável por expor a API REST, autenticar usuários, gerenciar produtos, vendas e o carrinho.  
Principais pontos encontrados no código:

- **Autenticação com JWT**  
- **Rotas protegidas** via middleware  
- **Sequelize ORM** para integração com PostgreSQL  
- **Models principais**: `User`, `Product`, `Sale`, `Cart`  
- **Controllers** organizados por domínio (produtos, vendas, autenticação)  
- **Migrações do banco** para criação das tabelas  

### Rotas principais
- `POST /api/login` → Autenticação de usuários  
- `GET /api/products` → Listar produtos  
- `POST /api/products` → Criar produto (admin)  
- `POST /api/cart` → Adicionar item ao carrinho  
- `GET /api/sales` → Listar vendas realizadas  
- `POST /api/sales` → Registrar nova venda  

---

## 💻 Frontend (React)

O frontend consome a API do backend e fornece uma interface moderna e funcional para o usuário.  
Principais pontos encontrados no código:

- **React + Hooks**  
- **Context API** (`CartContext`) para gerenciar o estado global do carrinho  
- **Axios** para comunicação com a API  
- **Styled Components** para estilização  
- **Páginas principais**:
  - `Home` → vitrine de produtos  
  - `Cart` → gerenciamento do carrinho  
  - `Checkout` → resumo da compra e finalização  
  - `Login` → autenticação do administrador  

### Componentes principais
- `Header` → topo da aplicação  
- `Footer` → rodapé  
- `CartList` → exibe os itens do carrinho  
- `ProductDetailForm` → formulário de detalhes do produto  

---

## Painel Administrativo

O projeto conta com uma página de administração acessível apenas a usuários autorizados.  
Através deste painel é possível:

- Inserir novos produtos (nome, preço, descrição, imagem, categoria).
- Editar produtos existentes.
- Excluir produtos.
- Gerenciar o catálogo exibido no frontend em tempo real.

Esse painel facilita o controle dos itens da loja, dispensando a necessidade de alterar dados diretamente no banco de dados.

---

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

### Pré-requisitos
Certifique-se de ter instalados:
- **Node.js** 
- **PostgreSQL** 
- **Git**

### Clonar o Repositório

```bash
git clone [https://github.com/VBDeveloping/VB_Art_App.git](https://github.com/VBDeveloping/VB_Art_App.git)
cd VB_Art_App