import React, { useState, useEffect } from 'react';
import { AiOutlinePaperClip, AiOutlineDelete, AiOutlineCheck, AiOutlineClose, AiOutlineDown, AiOutlineUp, AiOutlineEdit} from 'react-icons/ai';
import CustomAlert from '../../alert/CustomAlert';
import './PedidoDetail.css';

const PedidoDetail = ({ pedido, onClose, onDelete, onUpdate }) => {
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });
    const [attachments, setAttachments] = useState({
        imagemComunicadoUso64: '',
        imagemNotaFiscal64: '',
        imagemRemessa64: '',
        imagemDevolucao64: ''
    });
    const [link, setLink] = useState('');
    const [equipamentos, setEquipamentos] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState({
        paciente: pedido.paciente,
        hospital: pedido.hospital,
        linha: pedido.detalhes.linha,
        tipo: pedido.tipo,
        data: pedido.data,
        hora: pedido.detalhes.hora,
        medico: pedido.medico,
        responsabilidade: pedido.detalhes.responsabilidade,
        vendedor: pedido.detalhes.vendedor,
        instrumentador: pedido.detalhes.instrumentador,
        convenio: pedido.detalhes.convenio
    });

    useEffect(() => {
        const fetchPedidoDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/registrar/receberID/${pedido.idPaciente}`);
                const data = await response.json();
                setEquipamentos(data.equipamentos || []);
                setMateriais(data.materiais || []);
                setAttachments({
                    imagemComunicadoUso64: data.imagemComunicadoUso64 || '',
                    imagemNotaFiscal64: data.imagemNotaFiscal64 || '',
                    imagemRemessa64: data.imagemRemessa64 || '',
                    imagemDevolucao64: data.imagemDevolucao64 || ''
                });
                setLink(data.link || '');
            } catch (error) {
                console.error("Erro ao buscar detalhes do pedido:", error);
            }
        };

        fetchPedidoDetails();
    }, [pedido.idPaciente]);

    const handleFileUpload = async (event, field) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                try {
                    const response = await fetch(`http://localhost:8080/registrar/atualizarPedido/${pedido.idPaciente}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ [field]: base64String })
                    });
                    if (response.ok) {
                        setAttachments(prev => ({ ...prev, [field]: base64String }));
                        console.log(`Arquivo ${field} atualizado com sucesso.`);
                    } else {
                        console.error(`Erro ao atualizar ${field}:`, await response.text());
                    }
                } catch (error) {
                    console.error(`Erro ao atualizar ${field}:`, error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileDelete = async (field) => {
        try {
            const response = await fetch(`http://localhost:8080/registrar/atualizarPedido/${pedido.idPaciente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [field]: '' })
            });
            if (response.ok) {
                setAttachments(prev => ({ ...prev, [field]: '' }));
                console.log(`Arquivo ${field} removido com sucesso.`);
            } else {
                console.error(`Erro ao remover ${field}:`, await response.text());
            }
        } catch (error) {
            console.error(`Erro ao remover ${field}:`, error);
        }
    };

    const handleFieldChange = (field, value) => {
        setEditableFields((prevFields) => ({
            ...prevFields,
            [field]: value
        }));
    };

    const handleLinkChange = (e) => {
        setLink(e.target.value);
    };

    const mapPedidoToDatabaseFormat = (pedido) => {
        return {
            ...pedido,
            nomePaciente: pedido.paciente,
            dataProcedimento: pedido.data,
            tipoProcedimento: pedido.tipo,
            horaProcedimento: pedido.detalhes.hora,
            linha: pedido.detalhes.linha,
            responsabilidade: pedido.detalhes.responsabilidade,
            vendedor: pedido.detalhes.vendedor,
            instrumentador: pedido.detalhes.instrumentador,
            convenio: pedido.detalhes.convenio,
            carimboHorario: pedido.detalhes.carimboHorario
        };
    };
    
    const toggleEdit = () => {
        if (isEditing) {
            const updatedPedido = {
                ...pedido,
                paciente: editableFields.paciente,
                hospital: editableFields.hospital,
                tipo: editableFields.tipo,
                data: editableFields.data,
                medico: editableFields.medico,
                detalhes: {
                    ...pedido.detalhes,
                    linha: editableFields.linha,
                    hora: editableFields.hora,
                    responsabilidade: editableFields.responsabilidade,
                    vendedor: editableFields.vendedor,
                    instrumentador: editableFields.instrumentador,
                    convenio: editableFields.convenio
                }
            };
    
            const mappedPedido = mapPedidoToDatabaseFormat(updatedPedido);
            console.log("Atualizando pedido:", mappedPedido);
            onUpdate(mappedPedido);
            setAlert({ message: 'Pedido Atualizado com sucesso!', type: 'success', visible: true });
        }
        setIsEditing(!isEditing);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            toggleEdit();
        }
    };

    const handleSendToFaturamento = async () => {
        const payload = {
            hospital: editableFields.hospital,
            estado: pedido.estado || '',
            valorTotal: pedido.valorTotal || 0,
            status: '',
            motivo: '',
            linkAutorizacao: link,
            nomePaciente: editableFields.paciente,
            convenio: editableFields.convenio || '',
            tipoProcedimento: editableFields.tipo,
            dataProcedimento: editableFields.data,
            horaProcedimento: editableFields.hora,
            carimboHorario: pedido.detalhes.carimboHorario,
            idPaciente: pedido.idPaciente,
            vendedor: editableFields.vendedor,
            equipamentos,
            materiais,
            CNPJ: pedido.CNPJ || '',
            formaPagamento: pedido.formaPagamento || '',
            imagemBase64: attachments.imagemNotaFiscal64,
            imagemRemessa64: attachments.imagemRemessa64,
            imagemDevolucao64: attachments.imagemDevolucao64,
            imagemComunicado64: attachments.imagemComunicadoUso64
        };

        try {
            const response = await fetch('http://localhost:8080/faturamento/registrarFaturamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const confirmSend = window.confirm(`Tem certeza que deseja enviar o pedido #${pedido.idPaciente} para o Faturamento?`);
            if (confirmSend) {
                if (response.ok) {
                    await handleDeleteFaturamento();
                    onDelete(pedido.idPaciente, true);
                } else {
                    console.error("Erro ao enviar para faturamento:", await response.text());
                }
            }
        } catch (error) {
            console.error("Erro ao enviar para faturamento:", error);
        }
    };

    const handleDeleteFaturamento = async () => {
        try {
            const response = await fetch(`http://localhost:8080/registrar/deletarPedido/${pedido.idPaciente}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                onDelete(pedido.idPaciente);
            } else {
                console.error("Erro ao deletar pedido:", await response.text());
            }
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/registrar/deletarPedido/${pedido.idPaciente}`, {
                method: 'DELETE'
            });

            const confirmSend = window.confirm(`Tem certeza que deseja Deletar o pedido #${pedido.idPaciente}?`);
            if(confirmSend){
                if (response.ok) {
                    setAlert({ message: 'Pedido deletado com sucesso!', type: 'success', visible: true });
                    onDelete(pedido.idPaciente);
                } else {
                    console.error("Erro ao deletar pedido:", await response.text());
                    setAlert({ message: 'Erro ao deletar pedido!', type: 'error', visible: true });
                }
            }
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            setAlert({ message: 'Erro ao deletar pedido!', type: 'error', visible: true });
        }
    };

    const renderAttachmentButton = (field, label) => (
        <label>
            {attachments[field] ? (
                <div className="attachment-checked">
                    <AiOutlineCheck className="icon icon-checked" />
                    {label} já foi Anexado!
                    <AiOutlineClose className="icon icon-delete" onClick={() => handleFileDelete(field)} />
                </div>
            ) : (
                <>
                    <AiOutlinePaperClip className="icon" />
                    <input type="file" onChange={(e) => handleFileUpload(e, field)} />
                    Anexar {label}
                </>
            )}
        </label>
    );

    const truncateName = (name, length) => {
        return name.length > length ? `${name.substring(0, length)}...` : name;
    };

    const renderEditableField = (field, label) => (
        <div className="pedido-detail-field">
            <div className="label">{label}:</div>
            {isEditing ? (
                <input
                    type="text"
                    className="pedido-detail-input"
                    value={editableFields[field]}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            ) : (
                <span>{editableFields[field]}</span>
            )}
            <AiOutlineEdit className="icon icon-edit" onClick={toggleEdit} />
        </div>
    ); 

    useEffect(() => {
        setEditableFields({
            paciente: pedido.paciente,
            hospital: pedido.hospital,
            linha: pedido.detalhes.linha,
            tipo: pedido.tipo,
            data: pedido.data,
            hora: pedido.detalhes.hora,
            medico: pedido.medico,
            responsabilidade: pedido.detalhes.responsabilidade,
            vendedor: pedido.detalhes.vendedor,
            instrumentador: pedido.detalhes.instrumentador,
            convenio: pedido.detalhes.convenio
        });
    }, [pedido]);

    return ( 
        <div className="pedido-detail">
            <div className="pedido-detail-header">
                <div className="pedido-detail-title-container">
                    <button className="delete-button" onClick={() => handleDelete(pedido.idPaciente)}>
                        <AiOutlineDelete className="icon" />
                    </button>
                    <h2>Pedido #{pedido.idPaciente}</h2>
                    <button className="close-button" onClick={onClose}>
                        <AiOutlineClose className="icon" />
                    </button>
                </div>
            </div>
            <div className="pedido-detail-body">
            {renderEditableField('paciente', 'Paciente')}
            {renderEditableField('hospital', 'Hospital')}
            {renderEditableField('linha', 'Linha')}
            {renderEditableField('tipo', 'Tipo')}
            {renderEditableField('data', 'Data')}
            {renderEditableField('hora', 'Hora')}
            {renderEditableField('medico', 'Médico')}
            {renderEditableField('responsabilidade', 'Responsabilidade')}
            {renderEditableField('vendedor', 'Vendedor')}
            {renderEditableField('instrumentador', 'Instrumentador')}
            {renderEditableField('convenio', 'Convênio')}
                <div className="pedido-detail-attachments">
                    {renderAttachmentButton('imagemComunicadoUso64', 'Comunicado de Uso')}
                    {renderAttachmentButton('imagemNotaFiscal64', 'Nota Fiscal')}
                    {renderAttachmentButton('imagemRemessa64', 'Nota de Remessa')}
                    {renderAttachmentButton('imagemDevolucao64', 'Nota de Devolução')}
                </div>
                <div className="pedido-detail-field">
                    <input className='input-link'
                        type="text"
                        value={link}
                        onChange={handleLinkChange}
                        placeholder="Link de Autorização"
                    />
                </div>
                <div className="pedido-detail-equipamentos-materiais">
                    <button onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <AiOutlineDown /> : <AiOutlineUp />} Equipamentos e Materiais
                    </button>
                    {!isCollapsed && (
                        <div className="pedido-detail-equipamentos-materiais-content">
                            <div className="pedido-detail-field-matsequip">
                                <div className="label">Equipamentos:</div>
                                <ul>
                                    {equipamentos.map((equip, index) => (
                                        <li key={index} data-full-text={equip.nome}>
                                            {truncateName(equip.nome, 17)} - Quantidade: {equip.quantidade}
                                            <div className="tooltip">{equip.nome}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pedido-detail-field-matsequip">
                                <div className="label">Materiais:</div>
                                <ul>
                                    {materiais.map((mat, index) => (
                                        <li key={index} data-full-text={mat.nome}>
                                            {truncateName(mat.nome, 18)} - Quantidade: {mat.quantidade}
                                            <div className="tooltip">{mat.nome}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                <div className="pedido-detail-faturamento">
                    <button onClick={handleSendToFaturamento}>Enviar para Faturamento</button>
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

export default PedidoDetail;