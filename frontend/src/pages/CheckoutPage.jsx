import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import './Pages_Css/CheckoutPage.css';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        // Verificação de segurança adicional para garantir que o usuário está logado e o carrinho não está vazio
        if (!currentUser || cartItems.length === 0) {
            alert('Dados do pedido incompletos. Por favor, verifique seu carrinho e tente novamente.');
            return;
        }

        const orderData = {
            userId: currentUser.id,
            total_price: subtotal,
            items: cartItems.map(item => ({
                product_id: item.id,
                product_name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        };
        console.log('Dados do pedido enviados:', orderData);

        try {
            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Pedido finalizado com sucesso:', result);
                clearCart(); 
                navigate('/order-success'); 
            } else {
                console.error('Erro ao finalizar o pedido:', result.message);
                alert('Ocorreu um erro: ' + result.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Não foi possível conectar ao servidor.');
        }
    };

    return (
        <div className="checkout-container">
            <h2>Finalizar Compra</h2>
            <div className="checkout-content">
                <div className="order-summary">
                    <h3>Resumo do Pedido</h3>
                    {cartItems.length === 0 ? (
                        <p>Seu carrinho está vazio.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <p>{item.name} ({item.quantity})</p>
                                <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))
                    )}
                    <hr />
                    <div className="total-summary">
                        <h4>Subtotal</h4>
                        <h4>R$ {subtotal.toFixed(2)}</h4>
                    </div>
                </div>
                <div className="checkout-form-section">
                    <h3>Informações de Pagamento</h3>
                    <p>Você está comprando como: **{currentUser?.username || 'Convidado'}**</p>
                    <button 
                        onClick={handleCheckout} 
                        className="checkout-button"
                        disabled={cartItems.length === 0 || !currentUser}
                    >
                        Pagar Agora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;