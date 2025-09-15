const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../db');

// Rota de Registro (POST /api/auth/register)
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Validação básica
    if (!username || !email || !password || password.trim() === '') {
     return res.status(400).json({ 
        success: false, 
        message: 'Por favor, preencha todos os campos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;`,
            [username, email, hashedPassword]
        );

        const newUser = result.rows[0];
        console.log(`Novo usuário registrado: ${newUser.username}`);

        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso!',
            user: { name: newUser.username, email: newUser.email }
        });
    } catch (err) {
        if (err.code === '23505') { // Código de erro para violação de UNIQUE constraint (e-mail duplicado)
            res.status(409).json({
                success: false,
                message: 'Este e-mail já está em uso.'
            });
        } else {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });
        }
    }
});

// Rota de login (POST /api/auth/login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email e senha são obrigatórios..' 
        });
    }
    
    // Como já tem o registro, agora é só verificar se o email e senha batem
    try {
        const userResult = await pool.query(
            `SELECT id, username, email, password_hash FROM users WHERE email = $1;`,
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou senha incorretos.' });
        }

        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou senha incorretos.' });
        }
        // Colocação de erros no console do servidor
        console.log(`Login bem-sucedido para: ${user.username}`);
        res.json({
            success: true,
            message: 'Login bem-sucedido!',
            user: { username: user.username, email: user.email }
        });

    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor.' });
    }
});

// Rota para listar todos os clientes (GET /api/auth/users) Voltado para Admin
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, created_at FROM users;');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

module.exports = router;