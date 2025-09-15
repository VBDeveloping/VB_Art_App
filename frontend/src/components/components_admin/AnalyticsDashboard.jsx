import React, { useState, useEffect } from 'react';
import './admin_components.css';

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/orders/analytics');
            const data = await response.json();
            if (response.ok) {
                setAnalytics(data);
            } else {
                setMessage(`Erro ao carregar dados de análise: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return <p>Carregando análises...</p>;
    }

    if (message) {
        return <p className="error-message">{message}</p>;
    }

    return (
        <div className="analytics-dashboard-container">
            <h1>Análise de Vendas e Estoque</h1>
            <div className="summary-cards">
                <div className="card">
                    <h3>Total de Pedidos</h3>
                    <p className="metric">{analytics.totalOrders}</p>
                </div>
                <div className="card">
                    <h3>Valor Total de Vendas</h3>
                    <p className="metric">R$ {analytics.totalSales.toFixed(2)}</p>
                </div>
            </div>

            <div className="top-products-section">
                <h2>Produtos Mais Vendidos</h2>
                <ul className="top-products-list">
                    {analytics.topProducts.length > 0 ? (
                        analytics.topProducts.map((product, index) => (
                            <li key={index} className="top-product-item">
                                <span className="product-name">{product.product_name}</span>
                                <span className="product-quantity">{product.total_quantity} unidades</span>
                            </li>
                        ))
                    ) : (
                        <p>Nenhum produto vendido ainda.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;