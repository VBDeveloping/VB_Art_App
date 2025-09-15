import React, { useState, useEffect } from 'react';
import './admin_components.css';

const StoreSettings = () => {
    const [settings, setSettings] = useState({
        store_name: '',
        contact_email: '',
        phone_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        payment_methods: [],
        shipping_options: [],
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchSettings = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/settings');
            const data = await response.json();
            if (response.ok) {
                // Certifique-se de que os dados de pagamento e frete são arrays
                data.payment_methods = data.payment_methods || [];
                data.shipping_options = data.shipping_options || [];
                setSettings(data);
            } else {
                setMessage(`Erro ao carregar configurações: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            setMessage('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    // Funções para gerenciar métodos de pagamento
    const handlePaymentChange = (index, e) => {
        const newMethods = [...settings.payment_methods];
        newMethods[index].name = e.target.value;
        setSettings({ ...settings, payment_methods: newMethods });
    };

    const addPaymentMethod = () => {
        setSettings({ ...settings, payment_methods: [...settings.payment_methods, { name: '' }] });
    };

    const removePaymentMethod = (index) => {
        const newMethods = settings.payment_methods.filter((_, i) => i !== index);
        setSettings({ ...settings, payment_methods: newMethods });
    };

    // Funções para gerenciar opções de frete
    const handleShippingChange = (index, e) => {
        const { name, value } = e.target;
        const newOptions = [...settings.shipping_options];
        newOptions[index][name] = value;
        setSettings({ ...settings, shipping_options: newOptions });
    };

    const addShippingOption = () => {
        setSettings({ ...settings, shipping_options: [...settings.shipping_options, { name: '', price: '' }] });
    };

    const removeShippingOption = (index) => {
        const newOptions = settings.shipping_options.filter((_, i) => i !== index);
        setSettings({ ...settings, shipping_options: newOptions });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:3001/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Configurações salvas com sucesso!');
            } else {
                setMessage(`Erro ao salvar: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            setMessage('Erro ao conectar com o servidor.');
        }
    };

    if (loading) {
        return <p>Carregando configurações...</p>;
    }

    return (
        <div className="settings-container">
            <h1>Configurações da Loja</h1>
            {message && <p className="form-message">{message}</p>}
            <form onSubmit={handleFormSubmit} className="settings-form">
                <div className="form-section">
                    <h2>Informações Básicas</h2>
                    <div className="form-group">
                        <label htmlFor="store_name">Nome da Loja</label>
                        <input type="text" id="store_name" name="store_name" value={settings.store_name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact_email">E-mail de Contato</label>
                        <input type="email" id="contact_email" name="contact_email" value={settings.contact_email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number">Telefone</label>
                        <input type="tel" id="phone_number" name="phone_number" value={settings.phone_number} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address_line1">Endereço (Linha 1)</label>
                        <input type="text" id="address_line1" name="address_line1" value={settings.address_line1} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address_line2">Endereço (Linha 2)</label>
                        <input type="text" id="address_line2" name="address_line2" value={settings.address_line2} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">Cidade</label>
                        <input type="text" id="city" name="city" value={settings.city} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">Estado</label>
                        <input type="text" id="state" name="state" value={settings.state} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="zip_code">CEP</label>
                        <input type="text" id="zip_code" name="zip_code" value={settings.zip_code} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="form-section">
                    <h2>Métodos de Pagamento</h2>
                    {settings.payment_methods.map((method, index) => (
                        <div key={index} className="dynamic-input-group">
                            <input
                                type="text"
                                value={method.name}
                                onChange={(e) => handlePaymentChange(index, e)}
                                placeholder="Ex: Cartão de Crédito"
                            />
                            <button type="button" className="remove-button" onClick={() => removePaymentMethod(index)}>Remover</button>
                        </div>
                    ))}
                    <button type="button" className="add-dynamic-button" onClick={addPaymentMethod}>
                        Adicionar Método
                    </button>
                </div>

                <div className="form-section">
                    <h2>Opções de Frete</h2>
                    {settings.shipping_options.map((option, index) => (
                        <div key={index} className="dynamic-input-group">
                            <input
                                type="text"
                                name="name"
                                value={option.name}
                                onChange={(e) => handleShippingChange(index, e)}
                                placeholder="Ex: SEDEX"
                                style={{ flex: 2 }}
                            />
                            <input
                                type="number"
                                name="price"
                                value={option.price}
                                onChange={(e) => handleShippingChange(index, e)}
                                placeholder="Preço"
                                step="0.01"
                                style={{ flex: 1 }}
                            />
                            <button type="button" className="remove-button" onClick={() => removeShippingOption(index)}>Remover</button>
                        </div>
                    ))}
                    <button type="button" className="add-dynamic-button" onClick={addShippingOption}>
                        Adicionar Opção
                    </button>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="submit-button">Salvar Configurações</button>
                </div>
            </form>
        </div>
    );
};

export default StoreSettings;