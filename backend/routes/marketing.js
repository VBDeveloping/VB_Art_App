const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Rota para listar todos os banners (GET /api/marketing/banners)
router.get('/banners', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM banners ORDER BY created_at DESC;');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar banners:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para adicionar um novo banner (POST /api/marketing/banners)
router.post('/banners', async (req, res) => {
    const { imageUrl, title, subtitle, linkUrl, isActive } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO banners (image_url, title, subtitle, link_url, is_active)
             VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [imageUrl, title, subtitle, linkUrl, isActive]
        );
        res.status(201).json({ success: true, message: 'Banner adicionado com sucesso!', banner: result.rows[0] });
    } catch (err) {
        console.error('Erro ao adicionar banner:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para atualizar um banner existente (PUT /api/marketing/banners/:id)
router.put('/banners/:id', async (req, res) => {
    const { id } = req.params;
    const { imageUrl, title, subtitle, linkUrl, isActive } = req.body;
    try {
        const result = await pool.query(
            `UPDATE banners SET image_url = $1, title = $2, subtitle = $3, link_url = $4, is_active = $5
             WHERE id = $6 RETURNING *;`,
            [imageUrl, title, subtitle, linkUrl, isActive, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Banner não encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Banner atualizado com sucesso!', banner: result.rows[0] });
    } catch (err) {
        console.error('Erro ao atualizar banner:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para deletar um banner (DELETE /api/marketing/banners/:id)
router.delete('/banners/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM banners WHERE id = $1;', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Banner não encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Banner excluído com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir banner:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

module.exports = router;