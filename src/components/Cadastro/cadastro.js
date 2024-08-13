import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import './cadastro.css';
import emailjs from 'emailjs-com';
import CustomAlert from '../alert/CustomAlert'

const Cadastro = () => {
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });
    const [activeTab, setActiveTab] = useState('equipamentos');
    const [cargo, setCargo] = useState('');
    const [estado, setEstado] = useState('');
    const [nomeFuncionario, setNomeFuncionario] = useState('');
    const [nomeEquipamento, setNomeEquipamento] = useState('');
    const [linhaEquipamento, setLinhaEquipamento] = useState('');
    const [codigoEquipamento, setCodigoEquipamento] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleUppercaseInput = (e) => {
        const uppercaseValue = e.target.value.toUpperCase();
        setNomeFuncionario(uppercaseValue);
        setNomeEquipamento(uppercaseValue);
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_-';
        let password = '';
        for (let i = 0; i < 6; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleCadastroFuncionario = async () => {
        if (!nomeFuncionario || !cargo || !estado) {
            console.error("Todos os campos são obrigatórios.");
            return;
        }
    
        const funcionarioData = {
            cargoFuncionario: cargo,
            nomeFuncionario,
        };
    
        if (cargo.toUpperCase() === "MÉDICO") {
            try {
                const funcionarioResponse = await fetch('http://localhost:8080/funcionario/funcionarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(funcionarioData),
                });
    
                if(funcionarioResponse.ok){
                    setAlert({ message: "Médico Registrado com sucesso!", type: 'success', visible: true });
                } else {
                    setAlert({ message: "Erro ao Registrar o Médico", type: 'error', visible: true });
                    const errorData = await funcionarioResponse.json();
                    throw new Error(errorData.message || 'Erro ao registrar médico');
                }
            } catch (error) {
                console.error("Erro durante o registro:", error);
            }
            return;
        }
    
        const password = generatePassword();
    
        const userData = {
            username: nomeFuncionario,
            password,
            estado,
            cargo,
        };
    
        try {
            const registerResponse = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                throw new Error(errorData.message || 'Erro ao registrar usuário');
            }
    
            const funcionarioResponse = await fetch('http://localhost:8080/funcionario/funcionarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(funcionarioData),
            });
    
            if(funcionarioResponse.ok){
                setAlert({ message: "Funcionário Registrado com sucesso!", type: 'success', visible: true });
            } else {
                setAlert({ message: "Erro ao Registrar o Funcionário", type: 'error', visible: true });
                const errorData = await funcionarioResponse.json();
                throw new Error(errorData.message || 'Erro ao registrar funcionário');
            }
    
            const emailParams = {
                nomeFuncionario: nomeFuncionario,
                username: nomeFuncionario,
                password: password,
                cargo: cargo,
                estado: estado,
                to_email: 'tic2.itmf@gmail.com',
            };
    
            emailjs.send('service_mtkayy7', 'template_d1qhsgf', emailParams, '1ufQ0MJe18PJuLc24')
                .then((response) => {
                    console.log('E-mail enviado com sucesso!', response.status, response.text);
                })
                .catch((error) => {
                    console.error('Erro ao enviar o e-mail:', error);
                });
    
        } catch (error) {
            console.error("Erro durante o registro:", error);
        }
    };

    const handleCadastroEquipamento = async () => {
        if (!nomeEquipamento || !linhaEquipamento || !codigoEquipamento) {
            console.error("Todos os campos são obrigatórios.");
            return;
        }

        const equipamentoData = {
            nomeEquipamento: nomeEquipamento,
            linhaEquipamento: linhaEquipamento,
            codigoEquipamento: codigoEquipamento,
        };

        try {
            const equipamentoResponse = await fetch('http://localhost:8080/equipamento/equipamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(equipamentoData),
            });

            if(equipamentoResponse.ok){
                setAlert({ message: "Equipamento Registrado com sucesso!", type: 'success', visible: true });
            }

            if (!equipamentoResponse.ok) {
                setAlert({ message: "Erro ao Registrar o Equipamento", type: 'error', visible: true });
                const errorData = await equipamentoResponse.json();
                throw new Error(errorData.message || 'Erro ao registrar o equipamento');
                
            }

        } catch (error) {
            console.error("Erro durante o registro:", error);
        }
    }

    return (
        <div>
            <Navbar />
            <div className="cadastro-container-registro">
                <div className="tabs-cadastro">
                    <button 
                        className={activeTab === 'equipamentos' ? 'active' : ''} 
                        onClick={() => handleTabChange('equipamentos')}
                    >
                        Equipamentos
                    </button>
                    <button 
                        className={activeTab === 'funcionarios' ? 'active' : ''} 
                        onClick={() => handleTabChange('funcionarios')}
                    >
                        Funcionários
                    </button>
                </div>
                <div className="tab-content-cadastro">
                    {activeTab === 'equipamentos' && (
                        <motion.div 
                            className="form-container-cadastro"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.5 }}
                        >
                            <label>
                                Linha do Equipamento
                                <select className="select-cadastro" value={linhaEquipamento} onChange={(e) => setLinhaEquipamento(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    <option value="GERAL">GERAL</option>
                                    <option value="VASCULAR">VASCULAR</option>
                                    <option value="UROLOGIA">UROLOGIA</option>
                                    <option value="CARDÍACA">CARDÍACA</option>
                                    <option value="GERAL / VASCULAR">GERAL / VASCULAR</option>
                                    <option value="GERAL / CARDÍACA">GERAL / CARDÍACA</option>
                                    <option value="GERAL / UROLOGIA">GERAL / UROLOGIA</option>
                                    <option value="VASCULAR / CARDÍACA">VASCULAR / CARDÍACA</option>
                                    <option value="VASCULAR / UROLOGIA">VASCULAR / UROLOGIA</option>
                                    <option value="CARDÍACA / UROLOGIA">CARDÍACA / UROLOGIA</option>
                                </select>
                            </label>
                            <label>
                                Nome do Equipamento
                                <input 
                                className="input-cadastro" 
                                value={nomeEquipamento}
                                type="text" 
                                placeholder="Digite o nome do Equipamento..." 
                                onChange={handleUppercaseInput}
                                />
                            </label>
                            <label>
                                Código do Equipamento
                                <input 
                                className="input-cadastro" 
                                type="number" 
                                placeholder="Digite o código do Equipamento..."
                                value={codigoEquipamento}
                                onChange={(e) => setCodigoEquipamento(e.target.value)}
                                 />
                            </label>
                            <button className="submit-button" onClick={handleCadastroEquipamento}>Cadastrar Equipamento</button>
                        </motion.div>
                    )}
                    {activeTab === 'funcionarios' && (
                        <motion.div 
                            className="form-container-cadastro"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                        >
                            <label>
                                Cargo
                                <select 
                                    className="select-cadastro"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="VENDEDOR">VENDEDOR</option>
                                    <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                                    <option value="MÉDICO">MÉDICO</option>
                                </select>
                            </label>
                            <label>
                                Estado
                                <select 
                                    className="select-cadastro"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="CE">CE</option>
                                </select>
                            </label>
                            <label>
                                Nome do Funcionário
                                <input 
                                    className="input-cadastro" 
                                    type="text" 
                                    placeholder="Digite o nome do Funcionario..." 
                                    value={nomeFuncionario}
                                    onChange={handleUppercaseInput}
                                />
                            </label>
                            <button className="submit-button" onClick={handleCadastroFuncionario}>Cadastrar Funcionário</button>
                        </motion.div>
                    )}
                </div>
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

export default Cadastro;