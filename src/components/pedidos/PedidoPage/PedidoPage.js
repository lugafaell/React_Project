import React, { useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import './PedidoPage.css';
import CustomAlert from '../../alert/CustomAlert';
import CustomCheckbox from '../../checkbox/CustomCheckbox';
import axios from 'axios';

const PedidosPage = () => {
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });
    const [step, setStep] = useState(1);
    const [tipoProcedimento, setTipoProcedimento] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [activeTab, setActiveTab] = useState('equipamentos');

    const [hospital, setHospital] = useState('');
    const [linha, setLinha] = useState('');
    const [dataProcedimento, setDataProcedimento] = useState('');
    const [horaProcedimento, setHoraProcedimento] = useState('');
    const [instrumentador, setInstrumentador] = useState('');
    const [convenio, setConvenio] = useState('');
    const [medico, setMedico] = useState('');
    const [nomePaciente, setNomePaciente] = useState('');
    const [responsabilidade, setResponsabilidade] = useState('');
    const [vendedor, setVendedor] = useState('');

    const [tipoProcedimentoStep2, setTipoProcedimentoStep2] = useState('');

    const [equipamentos, setEquipamentos] = useState([
        { id: 1, nome: 'Equipamento 1', checked: false, quantidade: 1 },
        { id: 2, nome: 'Equipamento 2', checked: false, quantidade: 1 },
        { id: 3, nome: 'Equipamento 3', checked: false, quantidade: 1 },
        { id: 4, nome: 'Equipamento 4', checked: false, quantidade: 1 }
    ]);

    const [materiais, setMateriais] = useState([
        { id: 1, nome: 'Material 1', checked: false, quantidade: 1 },
        { id: 2, nome: 'Material 2', checked: false, quantidade: 1 },
        { id: 3, nome: 'Material 3', checked: false, quantidade: 1 },
        { id: 4, nome: 'Material 4', checked: false, quantidade: 1 }
    ]);

    const handleNextStep = () => {
        if (step === 2) {
            handleSubmit();
        } else {
            setStep(step + 1);
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleTipoProcedimentoChange = (e) => {
        setTipoProcedimentoStep2(e.target.value);
        setTipoProcedimento(e.target.value);
    };

    const handleCheckboxChange = (id, type) => {
        if (type === 'equipamentos') {
            setEquipamentos(equipamentos.map(equip => {
                if (equip.id === id) {
                    return { ...equip, checked: !equip.checked };
                }
                return equip;
            }));
        } else {
            setMateriais(materiais.map(material => {
                if (material.id === id) {
                    return { ...material, checked: !material.checked };
                }
                return material;
            }));
        }
    };

    const handleSelectAllChange = (type) => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        if (type === 'equipamentos') {
            setEquipamentos(equipamentos.map(equip => ({ ...equip, checked: newSelectAll })));
        } else {
            setMateriais(materiais.map(material => ({ ...material, checked: newSelectAll })));
        }
    };

    const handleQuantityChange = (id, type, value) => {
        if (type === 'equipamentos') {
            setEquipamentos(equipamentos.map(equip => {
                if (equip.id === id) {
                    return { ...equip, quantidade: value };
                }
                return equip;
            }));
        } else {
            setMateriais(materiais.map(material => {
                if (material.id === id) {
                    return { ...material, quantidade: value };
                }
                return material;
            }));
        }
    };

    const handleSubmit = async () => {
        const selectedEquipamentos = equipamentos.filter(equip => equip.checked).map(equip => ({
            nome: equip.nome,
            quantidade: equip.quantidade,
        }));
        const selectedMateriais = materiais.filter(material => material.checked).map(material => ({
            nome: material.nome,
            quantidade: material.quantidade,
        }));

        const now = new Date();
        const carimboHorario = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        const payload = {
            situacao: "",
            motivoCancelamento: "",
            estado: "",
            hospital,
            linha,
            dataProcedimento,
            horaProcedimento,
            linkAutorizacao: "",
            linkComunicado: "",
            carimboHorario,
            medico,
            nomePaciente,
            responsabilidade,
            tipoProcedimento,
            vendedor,
            instrumentador,
            convenio,
            equipamentos: selectedEquipamentos,
            materiais: selectedMateriais,
            imagemComunicadoUso64: "",
            imagemNotaFiscal64: "",
            imagemRemessa64: "",
            imagemDevolucao64: "",
            entregador: "",
        };

        try {
            await axios.post('http://localhost:8080/registrar/enviarPedido', payload);
            setAlert({ message: "Pedido enviado com sucesso!", type: 'success', visible: true });
        } catch (error) {
            console.error("Erro ao enviar o pedido:", error);
            setAlert({ message: "Erro ao enviar o pedido", type: 'error', visible: true });
        }
    };

    return (
        <div className={`main-container step-${step}`}>
            <Navbar />
            <div className="pedidos-container">
                <div className="formulario">
                    <h1 className="h1-styles-form">Formulário de Pedidos</h1>
                    <div className="form-steps">
                        <div className="form-step">
                            {step === 1 && (
                                <div className="form-steps-container-1">
                                    <div className="linha-campos">
                                        <div className="campo">
                                            <label>Hospital</label>
                                            <select value={hospital} onChange={(e) => setHospital(e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="hospital1">Hospital 1</option>
                                                <option value="hospital2">Hospital 2</option>
                                            </select>
                                        </div>
                                        <div className="campo">
                                            <label>Vendedor</label>
                                            <select value={vendedor} onChange={(e) => setVendedor(e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="Vendedor 1">Vendedor 1</option>
                                            </select>
                                        </div>
                                        <div className="campo">
                                            <label>Data do Procedimento</label>
                                            <input type="date" value={dataProcedimento} onChange={(e) => setDataProcedimento(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="linha-campos">
                                        <div className="campo">
                                            <label>Hora do Procedimento</label>
                                            <input type="time" value={horaProcedimento} onChange={(e) => setHoraProcedimento(e.target.value)} />
                                        </div>
                                        <div className="campo">
                                            <label>Instrumentador</label>
                                            <select value={instrumentador} onChange={(e) => setInstrumentador(e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="Instrumentador 1">Instrumentador 1</option>
                                            </select>
                                        </div>
                                        <div className="campo">
                                            <label>Convênio</label>
                                            <select value={convenio} onChange={(e) => setConvenio(e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="Convenio 1">Convenio 1</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="linha-campos">
                                        <div className="campo">
                                            <label>Médico</label>
                                            <select value={medico} onChange={(e) => setMedico(e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="Medico 1">Medico 1</option>
                                            </select>
                                        </div>
                                        <div className="campo">
                                            <label>Nome do Paciente</label>
                                            <input type="text" placeholder="Nome do Paciente" value={nomePaciente} onChange={(e) => setNomePaciente(e.target.value)} />
                                        </div>
                                        <div className="campo">
                                            <label>Esterelização</label>
                                            <select value={responsabilidade} onChange={(e) => setResponsabilidade(e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="Esterelização">Esterelização</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="form-step">
                            {step === 2 && (
                                <div className="form-steps-container-2">
                                    <div className="linha-campos">
                                        <div className="campo">
                                            <label>Linha</label>
                                            <select value={linha} onChange={(e) => setLinha(e.target.value)}>
                                                <option value="">Selecione...</option>
                                                <option value="Linha 1">Linha 1</option>
                                            </select>
                                        </div>
                                        <div className="campo">
                                            <label>Tipo do Procedimento</label>
                                            <select value={tipoProcedimentoStep2} onChange={handleTipoProcedimentoChange}>
                                                <option value="">Selecione...</option>
                                                <option value="procedimento1">Procedimento 1</option>
                                                <option value="procedimento2">Procedimento 2</option>
                                            </select>
                                        </div>
                                    </div>
                                    {tipoProcedimento && (
                                        <div className="tabs-container">
                                            <div className="tabs">
                                                <button
                                                    className={`tab-button ${activeTab === 'equipamentos' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('equipamentos')}
                                                >
                                                    Equipamentos
                                                </button>
                                                <button
                                                    className={`tab-button ${activeTab === 'materiais' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('materiais')}
                                                >
                                                    Materiais (OPME)
                                                </button>
                                            </div>
                                            <div className="tab-content">
                                                {activeTab === 'equipamentos' && (
                                                    <div className="lista-equipamentos">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>
                                                                    <CustomCheckbox
                                                                            checked={selectAll}
                                                                            onChange={() => handleSelectAllChange('equipamentos')}
                                                                        />
                                                                    </th>
                                                                    <th>Equipamento</th>
                                                                    <th>Código</th>
                                                                    <th>Quantidade</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {equipamentos.map(equip => (
                                                                    <tr key={equip.id}>
                                                                        <td>
                                                                            <CustomCheckbox
                                                                                checked={equip.checked}
                                                                                onChange={() => handleCheckboxChange(equip.id, 'equipamentos')}
                                                                            />
                                                                        </td>
                                                                        <td>{equip.nome}</td>
                                                                        <td>{equip.id}</td>
                                                                        <td>
                                                                            {equip.checked && (
                                                                                <input
                                                                                    type="number"
                                                                                    min="1"
                                                                                    value={equip.quantidade}
                                                                                    onChange={(e) => handleQuantityChange(equip.id, 'equipamentos', e.target.value)}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                                {activeTab === 'materiais' && (
                                                    <div className="lista-materiais">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>
                                                                    <CustomCheckbox
                                                                            checked={selectAll}
                                                                            onChange={() => handleSelectAllChange('materiais')}
                                                                        />
                                                                    </th>
                                                                    <th>Material</th>
                                                                    <th>Código</th>
                                                                    <th>Quantidade</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {materiais.map(material => (
                                                                    <tr key={material.id}>
                                                                        <td>
                                                                        <CustomCheckbox
                                                                                checked={material.checked}
                                                                                onChange={() => handleCheckboxChange(material.id, 'materiais')}
                                                                            />
                                                                        </td>
                                                                        <td>{material.nome}</td>
                                                                        <td>{material.id}</td>
                                                                        <td>
                                                                            {material.checked && (
                                                                                <input
                                                                                    type="number"
                                                                                    min="1"
                                                                                    value={material.quantidade}
                                                                                    onChange={(e) => handleQuantityChange(material.id, 'materiais', e.target.value)}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="botao-container">
                        {step === 2 && (
                            <button className="botao-voltar" onClick={handlePreviousStep}>
                                Voltar
                            </button>
                        )}
                        <button className="botao-enviar" onClick={handleNextStep}>
                            {step === 1 ? 'Próximo' : 'Enviar'}
                        </button>
                    </div>
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

export default PedidosPage;
