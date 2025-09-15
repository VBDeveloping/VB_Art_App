import React from "react";
import { useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import "./Pages_Css/Cart.css";

const Cart = () => {
    const { cartItems, removeFromCart, updateItemQuantity } = useCart(); 
    const { currentUser, toggleAuthModal } = useAuth();
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const navigate = useNavigate();

    const handleCheckoutClick = () => {
        if (cartItems.length === 0) {
            alert('Seu carrinho está vazio. Adicione produtos para continuar.');
            return;
        }
        
        // NOVO: Verifica se o usuário está logado
        if (!currentUser) {
            toggleAuthModal(); 
            return;
        }

        // Se o carrinho não estiver vazio e o usuário estiver logado, navega para o checkout
        navigate('/checkout');
    };

    return (
        <div className="Cart_Container">
            <div className="Cart_Content_Wrapper"> 
                <div className="Cart_Main">
                    <h1>Carrinho de Compras</h1>
                    {cartItems.length === 0 ? (
                        <div className="Cart_Empty_Message">
                            <p>Seu carrinho está vazio.</p>
                        </div>
                    ) : (
                        <div className="Cart_Items">
                            {cartItems.map(item => (
                                <div key={item.id} className="Cart_Item">
                                    <img src={item.image} alt={item.title} className="Cart_Item_Image" />
                                    <div className="Cart_Item_Details">
                                        <h3>{item.title}</h3>
                                        <p>Preço: R$ {parseFloat(item.price).toFixed(2)}</p>
                                        <p>Total: R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        <div className="Cart_Item_Quantity_Controls">
                                            <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button 
                                            className="Cart_Remove_Button"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="Cart_Subtotal">
                                <h3>Subtotal: R$ {subtotal.toFixed(2)}</h3>
                                <button 
                                    className="Cart_Checkout_Button"
                                    onClick={handleCheckoutClick}
                                >
                                    Finalizar Compra
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="Cart_Options">
                    <div className="Cart_Options_Title">
                        <h2>Você pode gostar também</h2>
                    </div>
                    <div className="Cart_Options_Cards">
                        {/* Renderizar os cards de produtos relacionados */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;