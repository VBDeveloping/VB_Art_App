import React, { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [currentUser, setCurrentUser] = useState(null);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const toggleAuthModal = () => {
        setIsAuthModalOpen(prev => !prev);
    };
    
    //logica do login, chamando a API do backend
    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login bem-sucedido!', data);
                setCurrentUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                toggleAuthModal();
            } else {
                console.error('Login falhou:', data.message);
                alert('Falha no login: ' + data.message);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    // Lógica do cadastro com chamada à API do backend
    const register = async (username, email, password) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Cadastro bem-sucedido!', data);
                setCurrentUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                toggleAuthModal();
                return true;
            } else {
                console.error('Registro falhou:', data.message);
                alert('Falha no registro: ' + data.message);
                return false;
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
            return false;
        }
    };

    //lógica do logout
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            login,
            register,
            logout,
            isAuthModalOpen,
            toggleAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );  
};