import React, { useState, useEffect } from 'react';
import './admin_components.css';

const MarketingDashboard = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingBanner, setEditingBanner] = useState(null);

    const [imageUrl, setImageUrl] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [isActive, setIsActive] = useState(true);

    const fetchBanners = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/marketing/banners');
            const data = await response.json();
            if (response.ok) {
                setBanners(data);
            } else {
                setMessage(`Erro ao carregar banners: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        const bannerData = {
            imageUrl,
            title,
            subtitle,
            linkUrl,
            isActive,
        };

        const url = editingBanner
            ? `http://localhost:3001/api/marketing/banners/${editingBanner.id}`
            : 'http://localhost:3001/api/marketing/banners';

        const method = editingBanner ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bannerData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(editingBanner ? 'Banner atualizado com sucesso!' : 'Banner adicionado com sucesso!');
                // Limpa o formulário
                setImageUrl('');
                setTitle('');
                setSubtitle('');
                setLinkUrl('');
                setIsActive(true);
                setEditingBanner(null);
                fetchBanners();
            } else {
                setMessage(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    const handleEditClick = (banner) => {
        setEditingBanner(banner);
        setImageUrl(banner.image_url);
        setTitle(banner.title);
        setSubtitle(banner.subtitle);
        setLinkUrl(banner.link_url);
        setIsActive(banner.is_active);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (bannerId) => {
        if (!window.confirm('Tem certeza que deseja excluir este banner?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:3001/api/marketing/banners/${bannerId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Banner excluído com sucesso!');
                fetchBanners();
            } else {
                setMessage(`Erro ao excluir: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    const handleCancelEdit = () => {
        setEditingBanner(null);
        setImageUrl('');
        setTitle('');
        setSubtitle('');
        setLinkUrl('');
        setIsActive(true);
    };

    return (
        <div className="marketing-container">
            <h1>Gestão de Marketing e Divulgação</h1>
            
            <div className="form-section">
                <h2>{editingBanner ? 'Editar Banner' : 'Adicionar Novo Banner'}</h2>
                <form onSubmit={handleFormSubmit} className="marketing-form">
                    <div className="form-group">
                        <label htmlFor="imageUrl">URL da Imagem</label>
                        <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Título</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subtitle">Subtítulo</label>
                        <input type="text" id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="linkUrl">URL de Destino</label>
                        <input type="text" id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                    </div>
                    <div className="form-group checkbox-group">
                        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        <label htmlFor="isActive">Ativo</label>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="add-button">
                            {editingBanner ? 'Salvar Alterações' : 'Adicionar Banner'}
                        </button>
                        {editingBanner && (
                            <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                                Cancelar Edição
                            </button>
                        )}
                    </div>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>

            <hr />

            <div className="banners-list-section">
                <h2>Banners Atuais</h2>
                {loading ? (
                    <p>Carregando banners...</p>
                ) : (
                    <table className="banners-table">
                        <thead>
                            <tr>
                                <th>Imagem</th>
                                <th>Título</th>
                                <th>Ativo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((banner) => (
                                <tr key={banner.id}>
                                    <td><img src={banner.image_url} alt={banner.title} className="banner-image" /></td>
                                    <td>
                                        <strong>{banner.title}</strong>
                                        <br />
                                        <small>{banner.subtitle}</small>
                                    </td>
                                    <td>{banner.is_active ? 'Sim' : 'Não'}</td>
                                    <td>
                                        <button className="action-button edit-button" onClick={() => handleEditClick(banner)}>Editar</button>
                                        <button className="action-button delete-button" onClick={() => handleDeleteClick(banner.id)}>Excluir</button>
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

export default MarketingDashboard;