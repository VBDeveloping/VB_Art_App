import React, { useState } from 'react';
import { FiX } from 'react-icons/fi'; 
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import './components.css';

const Auth = ({ toggleAuthModal }) => {
    
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);

    const handleSubmit = async (event) => { // Transforma a função em `async`
        event.preventDefault();
        
        let success = false;
        
        if (isLoginView) {
            // Aguarda o resultado da função `login`
            success = await login(email, password);
        } else {
            // Aguarda o resultado da função `register`
            success = await register(username, email, password);
            if (success) {
                setIsLoginView(true); // Volta para a visão de login após o registro
            }
        }

        if (success) {
            // Se for bem-sucedido, a modal já foi fechada pelo contexto
            // Oculta a modal de autenticação
            toggleAuthModal(); // Garante que a modal está fechada
            navigate('/');

            // Opcional: limpa os campos para a próxima vez que a modal for aberta
            setName('');
            setEmail('');
            setPassword('');
        }
    };

    const handleViewChange = () => {
        setIsLoginView(!isLoginView);
    };

    return (
        <div className="Auth_Modal_Overlay">
            <div className="Auth_Form_Wrapper">
                <button className="Auth_Close_Button" onClick={toggleAuthModal}>
                    <FiX />
                </button>
                <h2>{isLoginView ? 'Login' : 'Criar Conta'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <div className="Auth_Input_Group">
                            <label htmlFor="username">Nome</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="Auth_Input_Group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="Auth_Input_Group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="Auth_Button">
                        {isLoginView ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>
                <div className="Auth_Switch_View">
                    {isLoginView ? (
                        <p>Não tem uma conta? <span onClick={handleViewChange}>Crie uma agora</span></p>
                    ) : (
                        <p>Já tem uma conta? <span onClick={handleViewChange}>Faça o login</span></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;