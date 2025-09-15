const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Rota para obter as configurações da loja (GET /api/settings)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM settings WHERE id = 1;');
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Configurações não encontradas.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar configurações:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para atualizar as configurações da loja (PUT /api/settings)
router.put('/', async (req, res) => {
    const { 
        store_name, 
        contact_email, 
        phone_number, 
        address_line1, 
        address_line2, 
        city, 
        state, 
        zip_code, 
        payment_methods, 
        shipping_options 
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE settings
             SET store_name = $1, contact_email = $2, phone_number = $3, address_line1 = $4, address_line2 = $5, city = $6, state = $7, zip_code = $8,
             payment_methods = $9, shipping_options = $10
             WHERE id = 1 RETURNING *;`,
            [store_name, contact_email, phone_number, address_line1, address_line2, city, state, zip_code, payment_methods, shipping_options]
        );
        res.status(200).json({ success: true, message: 'Configurações atualizadas com sucesso!', settings: result.rows[0] });
    } catch (err) {
        console.error('Erro ao atualizar configurações:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

module.exports = router;