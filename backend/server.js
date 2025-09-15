// Importa os pacotes instalados
const express = require('express');
const cors = require('cors');

//Importa os aqruivos de rotas criados
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const marketingRoutes = require('./routes/marketing');
const financeRoutes = require('./routes/finance');
const settingsRoutes = require('./routes/settings');

// Importa a configuração do banco de dados
const { setupDatabase } = require('./db');

// Cria uma instância do Express
const app = express();

// Define a porta do servidor
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json()); // Permite que o servidor entenda JSON
app.use(cors());         // Permite que o frontend se comunique com o backend

// Conecta ao banco de dados e cria as tabelas
setupDatabase();

// Primeira rota de teste
app.get('/api/test', (req, res) => {
    res.json({ message: "API está funcionando!" });
});

// Usa as rotas importadas, prefixar sempre com /api/nomeDaRota
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/settings', settingsRoutes);

// Inicia o servidor e o faz "escutar" a porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});