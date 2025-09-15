const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Rota para listar todas as transações (GET /api/finance/transactions)
router.get('/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC;');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar transações:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para adicionar uma nova transação (POST /api/finance/transactions)
router.post('/transactions', async (req, res) => {
    const { description, amount, type } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO transactions (description, amount, type) VALUES ($1, $2, $3) RETURNING *;`,
            [description, amount, type]
        );
        res.status(201).json({ success: true, message: 'Transação adicionada com sucesso!', transaction: result.rows[0] });
    } catch (err) {
        console.error('Erro ao adicionar transação:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para deletar uma transação (DELETE /api/finance/transactions/:id)
router.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM transactions WHERE id = $1;', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada.' });
        }
        res.status(200).json({ success: true, message: 'Transação excluída com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir transação:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para obter o resumo financeiro por período (GET /api/finance/summary)
router.get('/summary', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END) AS total_revenue,
                SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END) AS total_expenses,
                SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END) AS net_profit
            FROM transactions;
        `);

        const summary = result.rows[0];
        res.status(200).json({
            totalRevenue: parseFloat(summary.total_revenue) || 0,
            totalExpenses: parseFloat(summary.total_expenses) || 0,
            netProfit: parseFloat(summary.net_profit) || 0,
        });
    } catch (err) {
        console.error('Erro ao buscar resumo financeiro:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para obter o fluxo de caixa por período (GET /api/finance/cash-flow)
router.get('/cash-flow', async (req, res) => {
    const { period, startDate, endDate } = req.query;
    let query;

    switch (period) {
        case 'daily':
            query = `
                SELECT
                    DATE_TRUNC('day', created_at) AS date,
                    SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END) AS cash_flow
                FROM transactions
                WHERE created_at >= NOW() - INTERVAL '30 days'
                GROUP BY date
                ORDER BY date ASC;
            `;
            break;
        case 'monthly':
            query = `
                SELECT
                    DATE_TRUNC('month', created_at) AS date,
                    SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END) AS cash_flow
                FROM transactions
                GROUP BY date
                ORDER BY date ASC;
            `;
            break;
        case 'custom':
            if (!startDate || !endDate) {
                return res.status(400).json({ success: false, message: 'Data de início e fim são obrigatórias para o período personalizado.' });
            }
            query = `
                SELECT
                    DATE_TRUNC('day', created_at) AS date,
                    SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END) AS cash_flow
                FROM transactions
                WHERE created_at BETWEEN $1 AND $2
                GROUP BY date
                ORDER BY date ASC;
            `;
            break;
        default:
            return res.status(400).json({ success: false, message: 'Período inválido.' });
    }

    try {
        const result = await pool.query(query, period === 'custom' ? [startDate, endDate] : []);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar fluxo de caixa:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

module.exports = router;