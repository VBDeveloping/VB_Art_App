const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vb_art_app_db',
    password: 'K1e2lvin!',
    port: 5432, 
});

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

async function setupDatabase() {
    try {
        await pool.query(createUsersTable);
        console.log('Tabela "users" criada com sucesso ou já existente.');

        await pool.query(createProductsTable);
        console.log('Tabela "products" criada com sucesso ou já existente.');

        console.log('Conexão com o banco de dados e tabelas criadas com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar ou criar tabelas:', err);
    }
}

module.exports = {
    pool,
    setupDatabase,
};