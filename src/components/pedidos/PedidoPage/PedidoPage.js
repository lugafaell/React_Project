import React, { useState, useEffect } from 'react';
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

    const [equipamentos, setEquipamentos] = useState([]);

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

    const procedimentosPorLinha = {
        GERAL: ['BARIATRICA', 'Outro Procedimento GERAL'],
        VASCULAR: ['VASCULAR 1', 'VASCULAR 2'],
    };

    const handleTipoProcedimentoChange = (e) => {
        const procedimentoSelecionado = e.target.value;
        setTipoProcedimentoStep2(procedimentoSelecionado);
        setTipoProcedimento(procedimentoSelecionado);
    };

    const handleCheckboxChange = (id, type) => {
        if (type === 'equipamentos') {
            setEquipamentos(prevEquipamentos =>
                prevEquipamentos.map(equip => 
                    equip.id === id ? { ...equip, checked: !equip.checked } : equip
                )
            );
        } else if (type === 'materiais') {
            setMateriais(prevMateriais =>
                prevMateriais.map(material => 
                    material.id === id ? { ...material, checked: !material.checked } : material
                )
            );
        }
    };

    const handleSelectAllChange = (type) => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
    
        if (type === 'equipamentos') {
            setEquipamentos(prevEquipamentos =>
                prevEquipamentos.map(equip => ({
                    ...equip,
                    checked: newSelectAll,
                    quantidade: newSelectAll ? 1 : equip.quantidade
                }))
            );
        } else if (type === 'materiais') {
            setMateriais(prevMateriais =>
                prevMateriais.map(material => ({
                    ...material,
                    checked: newSelectAll,
                    quantidade: newSelectAll ? 1 : material.quantidade
                }))
            );
        }
    };

    const handleQuantityChange = (id, type, value) => {
        if (type === 'equipamentos') {
            setEquipamentos(prevEquipamentos =>
                prevEquipamentos.map(equip => 
                    equip.id === id ? { ...equip, quantidade: value } : equip
                )
            );
        } else if (type === 'materiais') {
            setMateriais(prevMateriais =>
                prevMateriais.map(material => 
                    material.id === id ? { ...material, quantidade: value } : material
                )
            );
        }
    };

    const handleSubmit = async () => {
        const selectedEquipamentos = equipamentos.filter(equip => equip.checked).map(equip => ({
            nome: equip.nomeEquipamento + " - CÓD:" + equip.codigoEquipamento,
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

    useEffect(() => {
        if (linha) {
            axios.get('http://localhost:8080/equipamento/equipamentos', { params: { linha } })
                .then(response => {
                    const equipamentosComQuantidade = response.data.map(equip => ({
                        ...equip,
                        checked: false,
                        quantidade: 1
                    }));
                    setEquipamentos(equipamentosComQuantidade);
                })
                .catch(error => {
                    console.error("Erro ao obter equipamentos:", error);
                });
        }
    }, [linha]);

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
                                                <option value="GERAL">GERAL</option>
                                                <option value="VASCULAR">VASCULAR</option>
                                            </select>
                                        </div>
                                        <div className="campo">
                                            <label>Tipo do Procedimento</label>
                                            <select value={tipoProcedimentoStep2} onChange={handleTipoProcedimentoChange}>
                                                <option value="">Selecione...</option>
                                                {procedimentosPorLinha[linha]?.map((procedimento) => (
                                                    <option key={procedimento} value={procedimento}>
                                                        {procedimento}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {tipoProcedimentoStep2 && (
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
                                                                    <tr key={equip.id}> {/* Verifique se equip.id é único */}
                                                                        <td>
                                                                            <CustomCheckbox
                                                                                checked={equip.checked}
                                                                                onChange={() => handleCheckboxChange(equip.id, 'equipamentos')}
                                                                            />
                                                                        </td>
                                                                        <td>{equip.nomeEquipamento}</td>
                                                                        <td>{equip.codigoEquipamento}</td>
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
                                                                    <tr key={material.id}> {/* Verifique se material.id é único */}
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
