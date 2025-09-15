import React, { useState, useEffect } from 'react';
import './admin_components.css';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/users');
            const data = await response.json();
            if (response.ok) {
                setClients(data);
            } else {
                setMessage(`Erro ao carregar clientes: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="client-management-container">
            <h1>Gestão de Clientes</h1>
            {loading ? (
                <p>Carregando clientes...</p>
            ) : message ? (
                <p className="error-message">{message}</p>
            ) : (
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome de Usuário</th>
                            <th>E-mail</th>
                            <th>Membro Desde</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.username}</td>
                                <td>{client.email || 'Não informado'}</td>
                                <td>{new Date(client.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClientManagement;