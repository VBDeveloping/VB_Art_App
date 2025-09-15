import React, { useState, useEffect } from 'react';
import './admin_components.css';

const ProductManagement = () => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            } else {
                setMessage(`Erro ao carregar produtos: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async (event) => {
        event.preventDefault();
        setMessage('');

        const newProduct = {
            name,
            image_url: imageUrl,
            price: parseFloat(price),
            description,
            stock: parseInt(stock, 10),
        };

        const url = editingProduct
            ? `http://localhost:3001/api/products/${editingProduct.id}`
            : 'http://localhost:3001/api/products';

        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
                setName('');
                setImageUrl('');
                setPrice('');
                setDescription('');
                setStock('');
                setEditingProduct(null);
                fetchProducts();
            } else {
                setMessage(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Produto excluído com sucesso!');
                fetchProducts();
            } else {
                setMessage(`Erro ao excluir: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setImageUrl(product.image_url);
        setPrice(product.price);
        setDescription(product.description);
        setStock(product.stock);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setName('');
        setImageUrl('');
        setPrice('');
        setDescription('');
        setStock('');
    };

    return (
        <div className="product-management-container">
            <h1>Gestão de Produtos e Estoque</h1>
            <div className="form-section">
                <h2>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                <form onSubmit={handleAddProduct} className="admin-form">
                    <div className="form-group">
                        <label htmlFor="name">Nome do Produto</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUrl">URL da Imagem</label>
                        <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Preço</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Descrição</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Estoque</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>
                    <button type="submit" className="add-product-button">
                        {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                    </button>
                    {editingProduct && (
                        <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                            Cancelar Edição
                        </button>
                    )}
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>

            <hr />

            <div className="table-section">
                <h2>Produtos Cadastrados</h2>
                {loading ? (
                    <p>Carregando produtos...</p>
                ) : (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>R$ {parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button className="action-button edit-button" onClick={() => handleEditClick(product)}>Editar</button>
                                        <button className="action-button delete-button" onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
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

export default ProductManagement;