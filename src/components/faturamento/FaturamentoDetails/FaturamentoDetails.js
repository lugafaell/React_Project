import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import './FaturamentoDetails.css';
import { useSpring, animated } from '@react-spring/web';
import { FiExternalLink, FiEdit } from 'react-icons/fi';
import { AiOutlineDownload, AiFillDelete } from 'react-icons/ai';
import CustomCheckbox from '../../checkbox/CustomCheckbox';

const FaturamentoDetails = ({ faturamento, onClose, onDelete, onUpdate }) => {
    const styles = useSpring({
        from: { opacity: 0, transform: 'scale(0.9)' },
        to: { opacity: 1, transform: 'scale(1)' },
    });

    const [checkedItems, setCheckedItems] = useState({});
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [isEditingMotivo, setIsEditingMotivo] = useState(false);
    const [status, setStatus] = useState(faturamento.status);
    const [motivo, setMotivo] = useState(faturamento.motivo);

    const handleCheckboxChange = (itemName, index) => {
        setCheckedItems((prev) => ({
            ...prev,
            [itemName + index]: !prev[itemName + index],
        }));
    };

    const handleEditStatus = () => {
        setIsEditingStatus(!isEditingStatus);
    };

    const handleEditMotivo = () => {
        setIsEditingMotivo(!isEditingMotivo);
    };

    const saveStatus = async () => {
        try {
            const response = await fetch(`http://localhost:8080/faturamento/atualizarFaturamento/${faturamento._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                setIsEditingStatus(false);
                onUpdate({ ...faturamento, status });
            } else {
                alert('Erro ao salvar o status.');
            }
        } catch (error) {
            console.error('Erro ao salvar o status:', error);
            alert('Erro ao salvar o status.');
        }
    };

    const saveMotivo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/faturamento/atualizarFaturamento/${faturamento._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ motivo }),
            });
            if (response.ok) {
                setIsEditingMotivo(false);
                onUpdate({ ...faturamento, motivo });
            } else {
                alert('Erro ao salvar o motivo.');
            }
        } catch (error) {
            console.error('Erro ao salvar o motivo:', error);
            alert('Erro ao salvar o motivo.');
        }
    };

    const renderItems = (items) => {
        if (!items || items.length === 0) {
            return <p>Não há itens a serem exibidos</p>;
        }

        return items.map((item, index) => (
            <Collapsible
                key={index}
                trigger={<div className="collapsible-item">{item.nome}</div>}
            >
                {[...Array(item.quantidade)].map((_, i) => (
                    <div key={i} className="collapsible-content">
                        <CustomCheckbox
                            checked={checkedItems[item.nome + i] || false}
                            onChange={() => handleCheckboxChange(item.nome, i)}
                        />
                        <p> {i + 1}. {item.nome} </p>
                    </div>
                ))}
            </Collapsible>
        ));
    };

    const downloadBase64File = (base64String, fileName) => {
        const linkSource = base64String;
        const downloadLink = document.createElement('a');
        const fileType = base64String.substring(base64String.indexOf(':') + 1, base64String.indexOf(';'));
        downloadLink.href = linkSource;
        downloadLink.download = `${fileName}.${fileType.split('/')[1]}`;
        downloadLink.click();
    };

    const renderBase64Content = (base64String, fileName, noteType) => {
        if (!base64String) {
            return <p>Nenhuma Nota Anexada</p>;
        }

        const base64Header = base64String.substring(0, 30);
        if (base64Header.includes('data:image')) {
            return (
                <div className="base64-container">
                    <img src={base64String} alt="Imagem Base64" className="base64-image" />
                    <div className="overlay">{noteType}</div>
                    <button onClick={() => downloadBase64File(base64String, fileName)} className="download-button">
                        <AiOutlineDownload />
                    </button>
                </div>
            );
        } else if (base64Header.includes('data:application/pdf')) {
            return (
                <div className="base64-container">
                    <iframe src={base64String} className="base64-pdf" title="PDF Base64"></iframe>
                    <div className="overlay">{noteType}</div>
                    <button onClick={() => downloadBase64File(base64String, fileName)} className="download-button">
                        <AiOutlineDownload />
                    </button>
                </div>
            );
        } else {
            return <p>Formato de arquivo desconhecido</p>;
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/faturamento/deletarFaturamento/${faturamento._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                onDelete(faturamento._id);
                onClose();
            } else {
                alert('Erro ao remover o faturamento.');
            }
        } catch (error) {
            console.error('Erro ao remover o faturamento:', error);
            alert('Erro ao remover o faturamento.');
        }
    };

    return (
        <div className="faturamento-details-overlay" onClick={onClose}>
            <animated.div
                style={styles}
                className="faturamento-details-box"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-button" onClick={onClose}>X</button>
                <div className="header-container">
                    <h3>Detalhes do Faturamento</h3>
                    <button className="delete-button" onClick={handleDelete}>
                        <AiFillDelete />
                    </button>
                </div>
                <p><strong>Nome do Paciente:</strong> {faturamento.nomePaciente}</p>
                <p><strong>Data do Procedimento:</strong> {faturamento.dataProcedimento}</p>
                <p><strong>Hospital:</strong> {faturamento.hospital}</p>
                <p><strong>Status:</strong>
                    {isEditingStatus ? (
                        <select
                            className="input-edit"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveStatus();
                                }
                            }}
                            autoFocus
                        >
                            <option value="FATURADO">FATURADO</option>
                            <option value="AGUARDANDO AUTORIZAÇÃO">AGUARDANDO AUTORIZAÇÃO</option>
                        </select>
                    ) : (
                        <>
                            {status}
                            <button onClick={handleEditStatus} className="edit-button">
                                <FiEdit />
                            </button>
                        </>
                    )}
                </p>
                <p><strong>Motivo:</strong>
                    {isEditingMotivo ? (
                        <select
                            className="input-edit"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveMotivo();
                                }
                            }}
                            autoFocus
                        >
                            <option value="FINALIZADO">FINALIZADO</option>
                            <option value="COMUNICADO DE USO(ITMF)">COMUNICADO DE USO(ITMF)</option>
                        </select>
                    ) : (
                        <>
                            {motivo}
                            <button onClick={handleEditMotivo} className="edit-button">
                                <FiEdit />
                            </button>
                        </>
                    )}
                </p>
                <p><strong>Valor Total:</strong> {faturamento.valorTotal}</p>
                <p>
                    <strong>
                        <a href={faturamento.linkAutorizacao} target="_blank" rel="noopener noreferrer" className="authorization-link">
                            Link de Autorização <FiExternalLink />
                        </a>
                    </strong>
                </p>
                <h4>Equipamentos</h4>
                {renderItems(faturamento.equipamentos)}
                <h4>Materiais</h4>
                {renderItems(faturamento.materiais)}
                <h4>Notas</h4>
                <Collapsible trigger={<div className="collapsible-item">Ver Notas</div>}>
                    <div className="collapsible-content-images">
                        {renderBase64Content(faturamento.imagemBase64, 'nota-imagem', 'Nota Fiscal')}
                        {renderBase64Content(faturamento.imagemRemessa64, 'nota-remessa', 'Nota de Remessa')}
                        {renderBase64Content(faturamento.imagemDevolucao64, 'nota-devolucao', 'Nota de Devolução')}
                        {renderBase64Content(faturamento.imagemComunicado64, 'nota-comunicado', 'Comuni. de Uso')}
                    </div>
                </Collapsible>
            </animated.div>
        </div>
    );
};

export default FaturamentoDetails;
