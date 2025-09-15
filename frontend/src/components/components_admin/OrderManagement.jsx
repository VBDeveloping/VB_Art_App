import React, { useState, useEffect } from 'react';
import './admin_components.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/orders');
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                setMessage(`Erro ao carregar pedidos: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Função para atualizar o status do pedido
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Status do pedido atualizado com sucesso!');
                fetchOrders(); // Recarrega os pedidos para exibir a mudança
            } else {
                setMessage(`Erro ao atualizar status: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    return (
        <div className="order-management-container">
            <h1>Gestão de Pedidos</h1>
            {loading ? (
                <p>Carregando pedidos...</p>
            ) : message ? (
                <p className="error-message">{message}</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID do Pedido</th>
                            <th>Valor Total</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Itens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>R$ {parseFloat(order.total_price).toFixed(2)}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="Pendente">Pendente</option>
                                        <option value="Processando">Processando</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Entregue">Entregue</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>
                                    <ul>
                                        {order.items.map(item => (
                                            <li key={item.id}>
                                                {item.product_name} ({item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderManagement;