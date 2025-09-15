const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Rota para criar um novo pedido (POST /api/orders)
router.post('/', async (req, res) => {
    // Melhoria de segurança: Em uma aplicação real, o `userId`
    const { userId, total_price, items } = req.body;

    if (!userId || !total_price || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Dados do pedido incompletos.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total_price, created_at, status) VALUES ($1, $2, NOW(), 'concluído') RETURNING id;`,
            [userId, total_price]
        );
        const orderId = orderResult.rows[0].id;

        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5);`,
                [orderId, item.product_id, item.product_name, item.price, item.quantity]
            );
        }

        //  NOVO: Lógica para registrar a transação financeira 
        const transactionType = 'receita';
        const transactionDescription = `Venda do pedido #${orderId}`;
        
        await client.query(
            `INSERT INTO transactions (order_id, type, amount, description, date) VALUES ($1, $2, $3, $4, NOW());`,
            [orderId, transactionType, total_price, transactionDescription]
        );

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: 'Pedido criado com sucesso!', orderId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar o pedido:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    } finally {
        client.release();
    }
});

// Rota para listar todos os pedidos (GET /api/orders)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.id,
                o.total_price,
                o.status,
                o.created_at,
                json_agg(oi.*) AS items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC;
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para atualizar o status de um pedido (PUT /api/orders/:id/status)
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'O status do pedido é obrigatório.' });
    }

    try {
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Status do pedido atualizado com sucesso!', order: result.rows[0] });
    } catch (err) {
        console.error('Erro ao atualizar status do pedido:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Rota para obter métricas de análise (GET /api/orders/analytics)
router.get('/analytics', async (req, res) => {
    try {
        // Obter o número total de pedidos
        const totalOrdersResult = await pool.query('SELECT COUNT(*) FROM orders;');
        const totalOrders = parseInt(totalOrdersResult.rows[0].count, 10);

        // Obter o valor total das vendas
        const totalSalesResult = await pool.query('SELECT SUM(total_price) FROM orders;');
        const totalSales = parseFloat(totalSalesResult.rows[0].sum) || 0; // Se não houver vendas, retorna 0

        // Obter os 5 produtos mais vendidos
        const topProductsResult = await pool.query(`
            SELECT 
                product_name, 
                SUM(quantity) AS total_quantity
            FROM order_items
            GROUP BY product_name
            ORDER BY total_quantity DESC
            LIMIT 5;
        `);

        res.status(200).json({
            totalOrders,
            totalSales,
            topProducts: topProductsResult.rows,
        });

    } catch (err) {
        console.error('Erro ao buscar dados de análise:', err);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

module.exports = router;