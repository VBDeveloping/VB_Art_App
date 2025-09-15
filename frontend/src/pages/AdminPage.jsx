import React, { useState } from 'react';
import './Pages_Css/AdminPage.css';
// Importar componentes de gestão
import OrderManagement from '../components/components_admin/OrderManagement';
import ProductManagement from '../components/components_admin/ProductManagement';
import ClientManagement from '../components/components_admin/ClientManagement';
import AnalyticsDashboard from '../components/components_admin/AnalyticsDashboard';
import MarketingDashboard from '../components/components_admin/MarketingDashboard';
import FinanceDashboard from '../components/components_admin/FinanceDashboard';
import StoreSettings from '../components/components_admin/StoreSettings';

const AdminPage = () => {
    const [activeComponent, setActiveComponent] = useState('products');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'products':
                return <ProductManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'clients':
                return <ClientManagement />;
            case 'analytics':
                return <AnalyticsDashboard />;
            case 'marketing':
                return <MarketingDashboard />;
            case 'finance':
                return <FinanceDashboard />;
            case 'settings':
                return <StoreSettings />;
            default:
                return <div>Selecione uma opção no menu.</div>;
        }
    };

    return (
        <div className="admin-dashboard-container">
            <aside className="admin-sidebar">
                <nav>
                    <ul className="admin-menu">
                        <li 
                            onClick={() => setActiveComponent('products')}
                            className={activeComponent === 'products' ? 'active' : ''}
                        >
                            Gestão de Produtos e Estoque
                        </li>
                        <li
                            onClick={() => setActiveComponent('orders')}
                            className={activeComponent === 'orders' ? 'active' : ''}
                        >
                            Gestão de Pedidos
                        </li>
                        <li
                            onClick={() => setActiveComponent('clients')}
                            className={activeComponent === 'clients' ? 'active' : ''}
                        >
                            Gestão de Clientes
                        </li>
                        <li
                            onClick={() => setActiveComponent('analytics')}
                            className={activeComponent === 'sales' ? 'active' : ''}
                        >
                            Análise de Vendas e Desempenho
                        </li>
                        <li
                            onClick={() => setActiveComponent('marketing')}
                            className={activeComponent === 'marketing' ? 'active' : ''}
                        >
                            Marketing e Divulgação
                        </li>
                        <li
                            onClick={() => setActiveComponent('finance')}
                            className={activeComponent === 'finance' ? 'active' : ''}
                        >
                            Gestão Financeira
                        </li>
                        <li
                            onClick={() => setActiveComponent('settings')}
                            className={activeComponent === 'settings' ? 'active' : ''}
                        >
                            Configurações da Loja
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="admin-main-content">
                {renderComponent()}
            </main>
        </div>
    );
};

export default AdminPage;