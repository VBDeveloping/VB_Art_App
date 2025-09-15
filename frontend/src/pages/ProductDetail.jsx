import React, { useState, useEffect, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { useCart } from '../context/useCart';
import "./Pages_Css/ProductDetail.css";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Chama a API do backend para buscar o produto
                const response = await fetch(`http://localhost:3001/api/products/${productId}`);
                const data = await response.json();

                if (response.ok) {
                    setProduct(data);
                    console.log("Produto carregado da API:", data);
                } else {
                    console.error("Erro ao buscar produto:", data.message);
                    setProduct(null); // Define o produto como nulo se não for encontrado
                }
            } catch (error) {
                console.error("Erro na conexão com o servidor:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = useCallback(() => {
        if (product) {
            addToCart(product, quantity);
            console.log(`Adicionado ${quantity} de "${product.name}" ao carrinho!`);
        }
    }, [addToCart, product, quantity]);

    const handleBuyNow = () => {
        if (product) {
            console.log(`Comprando ${quantity} de "${product.name}" agora!`);
        }
    };

    if (loading) {
        return <div className="loading">Carregando detalhes do produto...</div>;
    }

    if (!product) {
        return <div className="not-found">Produto não encontrado.</div>;
    }

    return (
        <div className='ProductDetail_Container'>
            <div>
                <div className='ProductDetail_Center'>
                    <div className='ProductDetail_Left_Wrapper'>
                        <div className='ProductDetail_Image'>
                            <img src={product.image_url} alt={product.name} className='ProductDetail_Image_Img'/>
                        </div>
                    </div>
                    <div className='ProductDetail_Center_Wrapper'>
                        <div className='ProductDetail_Title'>
                            <h2>{product.name}</h2>
                        </div>
                        <div className='ProductDetail_Price'>
                            <h3>R$ {parseFloat(product.price).toFixed(2)}</h3>
                        </div>
                    </div>
                    <div className='ProductDetail_Right_Wrapper'>
                        <h3>R$ {parseFloat(product.price).toFixed(2)}</h3>
                        <h4>{product.stock > 0 ? 'Em estoque' : 'Esgotado'}</h4>
                        <div className="ProductDetail_Quantity">
                            <label htmlFor="quantity">Quantidade:</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                min="1"
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="ProductDetail_Quantity_Input"
                            />
                        </div>
                        
                        <button 
                            className="ProductDetail_Button_Add_Cart"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            Adicionar ao Carrinho
                        </button>
                        <button 
                            className="ProductDetail_Button_Buy_Now"
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                        >
                            Comprar Agora
                        </button>
                    </div>
                </div>
            </div>
            <div className='ProductDetail_Info'>
                <p>{product.description}</p>
            </div>
        </div>
    );
};

export default ProductDetail;