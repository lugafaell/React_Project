import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../alert/CustomAlert';
import Cookies from 'js-cookie';
import './LoginForm.css';
import logoImage from '../../imgs/Imagem_do_WhatsApp_de_2024-04-30_à_s__12.53.06_24f6df1d-removebg-preview.png';

const LoginForm = () => {
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSwitchToggle = () => {
        setIsAdmin(!isAdmin);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                const userResponse = await fetch(`http://localhost:8080/auth/users/${username}`);
                const userData = await userResponse.json();

                if (userResponse.ok) {
                    if (userData.cargo === 'Administrativo') {
                        if (isAdmin) {
                            setAlert({ message: "Login Administrativo Bem-sucedido!", type: 'success', visible: true });
                            Cookies.set('username', username, { expires: 7 });
                            setTimeout(() => {
                                navigate('/pedidos');
                            }, 1500);
                        } else {
                            setAlert({ message: "Necessária Validação Administrativa para esse usuário", type: 'warn', visible: true });
                        }
                    } else {
                        setAlert({ message: "Login Bem-sucedido!", type: 'success', visible: true });
                        Cookies.set('username', username, { expires: 7 });
                        setTimeout(() => {
                            navigate('/pedidos');
                        }, 1500);
                    }
                } else {
                    alert(userData.message || 'Erro ao buscar informações do usuário!');
                }
            } else {
                alert(data.message || 'Erro ao fazer login!');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setAlert({ message: "Erro ao Fazer Login!", type: 'error', visible: true });
        }
    };

    return (
        <div className="login-card">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuário"
                    className="login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="switch-container">
                    <label className="switch-label">Entrar como Administrador</label>
                    <label className="switch">
                        <input type="checkbox" checked={isAdmin} onChange={handleSwitchToggle} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <button type="submit" className="login-button">Fazer Login</button>
            </form>
            <div className="powered-by">
                <span>powered by</span>
                <img src={logoImage} alt="Company Logo" className="small-logo" />
            </div>
            {alert.visible && (
                <CustomAlert 
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ ...alert, visible: false })}
                />
            )}
        </div>
        
    );
};

export default LoginForm;
