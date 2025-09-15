import React, { useState, useEffect} from "react";
import ProductList from "../components/components_clients/ProductList";
import "./Pages_Css/Home.css";


const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/products');
                const data = await response.json();
                
                if (response.ok) {
                    setProducts(data);
                    console.log("Produtos carregados da API:", data);
                } else {
                    console.error("Erro ao buscar produtos:", data.message);
                }
            } catch (error) {
                console.error("Erro na conexão com o servidor:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="loading-message">Carregando produtos...</div>;
    }

    return (
        <div className="Home_Container">
            <main className="Home_Main">
                <ProductList products={products} />
            </main>
        </div>
    );
};

export default Home;