import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import './Navbar.css';
import logoImage from '../imgs/Imagem_do_WhatsApp_de_2024-04-30_à_s__12.53.06_24f6df1d-removebg-preview.png';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState({
        pedidos: false,
        faturamento: false,
        cadastro: false,
        administrativo: false,
    });

    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const savedUsername = Cookies.get('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen({
                    pedidos: false,
                    faturamento: false,
                    cadastro: false,
                    administrativo: false,
                });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = (menu) => {
        setDropdownOpen(prevState => {
            const newDropdownState = {
                pedidos: false,
                faturamento: false,
                cadastro: false,
                administrativo: false,
            };
            newDropdownState[menu] = !prevState[menu];
            return newDropdownState;
        });
    };

    const handleLogout = () => {
        Cookies.remove('username');
        navigate('/login', { replace: true });
    };

    const handleNavigation = (route) => {
        navigate(route);
        setDropdownOpen({
            pedidos: false,
            faturamento: false,
            cadastro: false,
            administrativo: false,
        });
    };

    return (
        <>
            {username && (
                <div className="user-info">
                    <p>Logado como: {username}</p>
                </div>
            )}
            <nav className="navbar" ref={dropdownRef}>
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <img src={logoImage} alt="Logo" />
                    </div>
                    <ul className="navbar-links">
                        <li onClick={() => toggleDropdown('pedidos')}>
                            <a href="#pedidos" className="has-dropdown">Pedidos</a>
                            {dropdownOpen.pedidos && (
                                <ul className="dropdown-menu dropdown-visible">
                                    {location.pathname !== '/pedidos' && (
                                        <li><a href="#!" onClick={() => handleNavigation('/pedidos')}>Formulário de Pedidos</a></li>
                                    )}
                                    {location.pathname !== '/pedidosList' && (
                                        <li><a href="#!" onClick={() => handleNavigation('/pedidosList')}>Lista de Pedidos</a></li>
                                    )}
                                </ul>
                            )}
                        </li>
                        <li onClick={() => toggleDropdown('faturamento')}>
                            <a href="#faturamento" className="has-dropdown">Faturamento</a>
                            {dropdownOpen.faturamento && (
                                <ul className="dropdown-menu dropdown-visible">
                                    {location.pathname !== '/faturamentoList' && (
                                        <li><a href="#!" onClick={() => handleNavigation('/faturamentoList')}>Lista de Faturamentos</a></li>
                                    )}
                                </ul>
                            )}
                        </li>
                        <li onClick={() => toggleDropdown('cadastro')}>
                            <a href="#cadastro" className="has-dropdown">Cadastro</a>
                            {dropdownOpen.cadastro && (
                                <ul className="dropdown-menu dropdown-visible">
                                    {location.pathname !== '/cadastro' && (
                                        <li><a href="#!" onClick={() => handleNavigation('/cadastro')}>Registro</a></li>
                                    )}
                                </ul>
                            )}
                        </li>
                        <li onClick={() => toggleDropdown('administrativo')}>
                            <a href="#administrativo" className="has-dropdown">Administrativo</a>
                            {dropdownOpen.administrativo && (
                                <ul className="dropdown-menu dropdown-visible">
                                    <li><a href="#sub-administrativo1">Sub Administrativo 1</a></li>
                                    <li><a href="#sub-administrativo2">Sub Administrativo 2</a></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                <div className="navbar-user">
                    <button className="logout-button" onClick={handleLogout}>
                        <FiLogOut />
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
