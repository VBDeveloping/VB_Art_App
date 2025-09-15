import React, { useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import './Pages_Css/Profile.css';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    // Use `useEffect` para a lógica de redirecionamento
    useEffect(() => {
        // Redireciona para a página inicial se o usuário não estiver logado
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]); // Adiciona as dependências para evitar loops

    // Se o usuário não existir, não renderiza nada
    if (!currentUser) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/'); // Redireciona após o logout
    };

    return (
        <div className="Profile_Container">
            <div className="Profile_Card">
                <h1>Meu Perfil</h1>
                <div className="Profile_Info">
                    <p><strong>Nome:</strong> {currentUser.username}</p>
                    <p><strong>E-mail:</strong> {currentUser.email}</p>
                </div>
                <button onClick={handleLogout} className="Profile_Logout_Button">
                    Sair
                </button>
            </div>
        </div>
    );
};

export default Profile;