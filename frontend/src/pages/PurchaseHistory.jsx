import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './Pages_Css/PurchaseHistory.css';


const PurchaseHistory = () => {
    
    // Estado para armazenar os pedidos do usuário
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Usar `currentUser` para verificar o estado de login
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Use useEffect para a lógica de redirecionamento
    useEffect(() => {
        // Redireciona se o usuário não estiver logado
        if (!currentUser || !currentUser.id) {
            setLoading(false);
            return; // Interrompe a execução para evitar a chamada à API
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/orders/user/${currentUser.id}`);
                const data = await response.json();

                if (response.ok) {
                    setOrders(data); // Atualiza o estado com os pedidos recebidos
                } else {
                    setError(data.message || 'Erro ao buscar o histórico de compras.');
                }
            } catch (err) {
                // Loga o erro completo para depuração
                console.error('Erro na requisição:', err); 
                // Define o erro para a tela, com uma mensagem mais amigável
                setError('Não foi possível conectar ao servidor.'); 
                
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]); // Dependências: re-executa se o usuário mudar
    
    // Exibe o estado de carregamento
    if (loading) {
        return <div className="loading-message">Carregando histórico...</div>;
    }
    
    // Se o usuário não existir, não renderiza nada
    if (!currentUser) {
      return (
        <div className="unauthorized">
          <h2>Acesso Negado</h2>
          <p>Você precisa estar logado para ver o histórico de compras.</p>
          <Link to="/" onClick={() => navigate('/')}>Voltar para a página inicial</Link>
        </div>
      );
    }

    // Exibe a mensagem de erro se a requisição falhar
    if (error) {
        return <div className="error-message">Erro: {error}</div>;
    }

    return (
        <div className="PurchaseHistory_Container">
            <div className="PurchaseHistory_Header">
                <h1>Histórico de Compras</h1>
            </div>
            {orders.length > 0 ? (
                <ul className="PurchaseHistory_List">
                    {orders.map(order => (
                        <li key={order.id} className="PurchaseHistory_Item">
                            <div className="PurchaseHistory_Details">
                                <span className="PurchaseHistory_Date">Data: {new Date(order.created_at).toLocaleDateString()}</span>
                                <span className="PurchaseHistory_Total">Total: R${order.total_price.toFixed(2)}</span>
                                <span className="PurchaseHistory_Items">{order.items.length} itens</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="PurchaseHistory_Empty">
                    <p>Você ainda não fez nenhuma compra.</p>
                    <Link to="/" className="PurchaseHistory_Link">Comece a comprar agora!</Link>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;