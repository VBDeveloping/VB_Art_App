import React, {useState} from "react";
import { FiSearch, FiUser, FiShoppingCart, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
// Importação de css
import "./components.css";
// Importação de contextos
import { useCart } from '../../context/useCart';
import { useAuth } from "../../context/useAuth";

const Header = ({ toggleAuthModal  }) => {

    const { currentUser, logout } = useAuth();
    const { cartItems } = useCart();
    
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className="Header_Container">
            <div className="Header_Logo">
                <Link to = '/' className = 'Header_Logo_Link'>
                    <h1>VB Art</h1>
                </Link>
            </div>
            <div className="Header_Search_Wrapper">
                <FiSearch className="Header_Search_Icon"/>
                <input 
                type="text" 
                placeholder="Procure sua próxima obra de arte..." 
                className="Header_Search_Input"
                value = {searchValue}
                onChange = {handleSearchChange}/>
            </div>
            <div className="Header_Auth_Cart">
                {currentUser ? (
                    // Se estiver logado, exibe o nome do usuário e o botão de logout
                    <div className="Header_User_Menu">
                        <span className="Header_User_Name" onClick={toggleMenu}>Olá, {currentUser.username}!</span>
                        {isMenuOpen && (
                            <div className="Header_Dropdown_Content">
                                <Link to="/profile" className="Header_Dropdown_Link">Perfil</Link>
                                <Link to="/history" className="Header_Dropdown_Link">Histórico de Compras</Link>
                                <button onClick={handleLogout} className="Header_Dropdown_Button">
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Se não estiver logado, exibe o botão de login para abrir o modal
                    <button className="Header_Auth_Button" onClick={toggleAuthModal}>
                        <FiUser className="Header_Auth_Icon" />
                    </button>
                )}
                <Link to ='/Cart'>
                    <FiShoppingCart className="Header_Cart_Icon"/>
                    {totalItems > 0 && (
                    <span className="Header_Cart_Count">{totalItems}</span>
                )}
                </Link>
            </div>
        </div>
    );
};

export default Header;