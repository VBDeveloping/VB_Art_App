const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Rota para listar todos os produtos (GET /api/products)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products;');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para buscar um único produto por ID (GET /api/products/:id)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1;', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Produto não encontrado.' 
            });
        }
        
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor.' 
        });
    }
});

// Rota para adicionar um novo produto (POST /api/products)
router.post('/', async (req, res) => {
    const { name, image_url, price, description, stock } = req.body;
    
    // Validação básica
    if (!name || !price || stock === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'Nome, preço e estoque do produto são obrigatórios.' 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO products (name, image_url, price, description, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [name, image_url, price, description, stock]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Produto adicionado com sucesso!',
            product: result.rows[0]
        });
    } catch (err) {
        console.error('Erro ao adicionar produto:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor.' 
        });
    }
});

// Rota para editar um produto (PUT /api/products/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image_url, price, description, stock } = req.body;

    // Validação básica
    if (!name || !price || stock === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: 'Nome, preço e estoque do produto são obrigatórios.' 
        });
    }

    try {
        const result = await pool.query(
            `UPDATE products SET name = $1, image_url = $2, price = $3, description = $4, stock = $5 WHERE id = $6 RETURNING *;`,
            [name, image_url, price, description, stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Produto atualizado com sucesso!', product: result.rows[0] });
    } catch (err) {
        console.error('Erro ao editar produto:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para excluir um produto (DELETE /api/products/:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *;', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Produto excluído com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir produto:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

module.exports = router;