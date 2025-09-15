import React, { useState, useEffect, useCallback } from 'react';
import './admin_components.css';

const FinanceDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [cashFlow, setCashFlow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('receita');

    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/finance/transactions');
            const data = await response.json();
            if (response.ok) {
                setTransactions(data);
            } else {
                setMessage(`Erro ao carregar transações: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/finance/summary');
            const data = await response.json();
            if (response.ok) {
                setAnalytics(data);
            } else {
                setMessage(`Erro ao carregar análises: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        }
    };

    // A função fetchCashFlow agora é memorizada com useCallback
    const fetchCashFlow = useCallback(async () => {
        setCashFlow([]); // Limpa os dados anteriores
        setMessage('');

        let url = `http://localhost:3001/api/finance/cash-flow?period=${selectedPeriod}`;
        if (selectedPeriod === 'custom') {
            if (!startDate || !endDate) {
                setMessage('Por favor, selecione uma data de início e fim.');
                return;
            }
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setCashFlow(data);
            } else {
                setMessage(`Erro ao carregar fluxo de caixa: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        }
    }, [selectedPeriod, startDate, endDate]); // Dependências de useCallback

    // Carrega dados iniciais e análises
    useEffect(() => {
        const initialFetch = async () => {
            await fetchTransactions();
            await fetchAnalytics();
            await fetchCashFlow(); // Chama a função aqui também
            setLoading(false);
        };
        initialFetch();
    }, [fetchCashFlow]); // Adiciona fetchCashFlow como dependência

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        const transactionData = {
            description,
            amount: parseFloat(amount),
            type,
        };

        try {
            const response = await fetch('http://localhost:3001/api/finance/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Transação adicionada com sucesso!');
                setDescription('');
                setAmount('');
                setType('receita');
                // Recarrega os dados após a adição
                fetchTransactions();
                fetchAnalytics();
                fetchCashFlow();
            } else {
                setMessage(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    const handleDeleteClick = async (transactionId) => {
        if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:3001/api/finance/transactions/${transactionId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Transação excluída com sucesso!');
                fetchTransactions();
                fetchAnalytics();
                fetchCashFlow();
            } else {
                setMessage(`Erro ao excluir: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    const calculateBalance = () => {
        return transactions.reduce((total, transaction) => {
            if (transaction.type === 'receita') {
                return total + parseFloat(transaction.amount);
            } else {
                return total - parseFloat(transaction.amount);
            }
        }, 0);
    };

    const balance = calculateBalance();

    if (loading) {
        return <p>Carregando finanças...</p>;
    }

    return (
        <div className="finance-container">
            <h1>Gestão Financeira</h1>
            
            {analytics && (
                <div className="analytics-summary-cards">
                    <div className="card-item card-green">
                        <h3>Receita Total</h3>
                        <p className="metric">R$ {analytics.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="card-item card-red">
                        <h3>Despesa Total</h3>
                        <p className="metric">R$ {analytics.totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="card-item card-blue">
                        <h3>Lucro Líquido</h3>
                        <p className="metric">R$ {analytics.netProfit.toFixed(2)}</p>
                    </div>
                </div>
            )}

            <div className="balance-summary">
                <h2>Saldo Atual: <span className={balance >= 0 ? 'positive' : 'negative'}>R$ {balance.toFixed(2)}</span></h2>
            </div>

            <div className="form-section">
                <h2>Adicionar Nova Transação</h2>
                <form onSubmit={handleFormSubmit} className="finance-form">
                    <div className="form-group">
                        <label htmlFor="description">Descrição</label>
                        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Valor</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Tipo</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
                            <option value="receita">Receita</option>
                            <option value="despesa">Despesa</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">Adicionar Transação</button>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>

            <hr />

            <div className="cash-flow-section">
                <h2>Fluxo de Caixa por Período</h2>
                <div className="period-selector">
                    <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                        <option value="monthly">Mensal</option>
                        <option value="daily">Últimos 30 dias</option>
                        <option value="custom">Período Personalizado</option>
                    </select>
                    {selectedPeriod === 'custom' && (
                        <div className="custom-dates">
                            <label htmlFor="start-date">Início:</label>
                            <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <label htmlFor="end-date">Fim:</label>
                            <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    )}
                </div>
                {cashFlow.length > 0 ? (
                    <table className="cash-flow-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Fluxo de Caixa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashFlow.map((flow, index) => (
                                <tr key={index} className={flow.cash_flow >= 0 ? 'positive-flow' : 'negative-flow'}>
                                    <td>{new Date(flow.date).toLocaleDateString()}</td>
                                    <td>R$ {parseFloat(flow.cash_flow).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum dado de fluxo de caixa disponível para o período selecionado.</p>
                )}
            </div>

            <hr />

            <div className="transactions-list-section">
                <h2>Histórico de Transações</h2>
                {transactions.length === 0 ? (
                    <p>Nenhuma transação registrada.</p>
                ) : (
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Tipo</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className={transaction.type === 'receita' ? 'row-receita' : 'row-despesa'}>
                                    <td>{transaction.description}</td>
                                    <td>R$ {parseFloat(transaction.amount).toFixed(2)}</td>
                                    <td>{transaction.type}</td>
                                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button className="action-button delete-button" onClick={() => handleDeleteClick(transaction.id)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FinanceDashboard;