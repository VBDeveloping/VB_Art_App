//importaçãos das ferramentas do React
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//importação dos componentes que estarão em todas as paginas
import Header from './components/components_clients/Header';
import Footer from './components/components_clients/Footer';
import Auth from './components/components_clients/Auth';
//Importação das páginas
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import PurchaseHistory from './pages/PurchaseHistory';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
//importação dos arquivos contexts
import { CartProvider } from './context/CartContext'
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from './context/useAuth';

//importação do css
import './App.css';

const App = () => {
    return (
      <BrowserRouter>
        <AuthProvider>
          <AppContent /> {/* Adiciona um novo componente para acessar o contexto */}
        </AuthProvider>
      </BrowserRouter>
    );
};

// NOVO: Este componente agora tem acesso ao contexto
const AppContent = () => {
  const { isAuthModalOpen, toggleAuthModal } = useAuth();

  return (
    <CartProvider> 
      <div className="App font-sans">
        <Header toggleAuthModal={toggleAuthModal} /> {/* A função ainda precisa ser passada ao Header */}
        <main>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<PurchaseHistory />}/>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <Footer />
        {isAuthModalOpen && <Auth toggleAuthModal={toggleAuthModal} />}
      </div>
    </CartProvider>
  );
};


export default App;