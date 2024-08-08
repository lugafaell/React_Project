import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import PedidoDetail from '../PedidoDetail/PedidoDetail';
import CustomAlert from '../../alert/CustomAlert';
import './PedidosList.css';

const PedidosList = () => {
    const [pedidos, setPedidos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [visiblePedidos, setVisiblePedidos] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:8080/registrar/receberPedidos');
                const data = await response.json();

                const updatedData = data.map(pedido => {
                    const status = getStatusByDate(pedido.dataProcedimento);
                    return {
                        idPaciente: pedido.idPaciente,
                        paciente: pedido.nomePaciente,
                        data: pedido.dataProcedimento,
                        hospital: pedido.hospital,
                        tipo: pedido.tipoProcedimento,
                        medico: pedido.medico,
                        status,
                        detalhes: {
                            idPaciente: pedido.IdPaciente,
                            linha: pedido.linha,
                            hora: pedido.horaProcedimento,
                            carimboHorario: pedido.carimboHorario,
                            responsabilidade: pedido.responsabilidade,
                            vendedor: pedido.vendedor,
                            instrumentador: pedido.instrumentador,
                            convenio: pedido.convenio
                        }
                    };
                });

                setPedidos(updatedData);
                setVisiblePedidos(sortPedidosByDate(updatedData));
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            }
        };
        fetchPedidos();
    }, []);

    useEffect(() => {
        const items = document.querySelectorAll('.pedido-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 300);
        });
    }, [visiblePedidos]);

    const getStatusByDate = (date) => {
        const today = new Date();
        const [year, month, day] = date.split('-').map(Number);
        const procedureDate = new Date(year, month - 1, day);

        if (procedureDate.getTime() < today.setHours(0, 0, 0, 0)) {
            return 'red';
        } else if (procedureDate.getTime() === today.setHours(0, 0, 0, 0)) {
            return 'green';
        } else {
            return 'yellow';
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        const filtered = pedidos.filter(pedido =>
            pedido.paciente.toLowerCase().includes(event.target.value.toLowerCase()) ||
            pedido.data.includes(event.target.value) ||
            pedido.hospital.toLowerCase().includes(event.target.value.toLowerCase()) ||
            pedido.tipo.toLowerCase().includes(event.target.value.toLowerCase()) ||
            pedido.medico.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setVisiblePedidos(sortPedidosByDate(filtered));
    };

    const handlePedidoClick = (pedido) => {
        setSelectedPedido(pedido);
        setTimeout(() => {
            const detailElement = document.querySelector('.pedido-detail');
            if (detailElement) {
                detailElement.classList.add('open');
            }
        }, 100);
    };

    const handleDetailClose = () => {
        const detailElement = document.querySelector('.pedido-detail');
        if (detailElement) {
            detailElement.classList.remove('open');
        }
        setTimeout(() => {
            setSelectedPedido(null);
        }, 300);
    };

    const handleDelete = (idPaciente, isFaturamento = false) => {
        setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.idPaciente !== idPaciente));
        setVisiblePedidos((prevVisiblePedidos) => prevVisiblePedidos.filter((pedido) => pedido.idPaciente !== idPaciente));
        
        setAlert({
            message: isFaturamento ? "Pedido Enviado Para Faturamento com Sucesso!" : "Pedido Deletado com Sucesso!",
            type: 'success',
            visible: true
        });
        handleDetailClose();
        setTimeout(() => {
            setAlert({ ...alert, visible: false });
        }, 3000);
    };

    const handleUpdatePedido = (updatedPedido) => {
        handleSave(updatedPedido);
        setPedidos((prevPedidos) =>
            prevPedidos.map((pedido) =>
                pedido.idPaciente === updatedPedido.idPaciente ? updatedPedido : pedido
            )
        );
        setVisiblePedidos((prevVisiblePedidos) =>
            prevVisiblePedidos.map((pedido) =>
                pedido.idPaciente === updatedPedido.idPaciente ? updatedPedido : pedido
            )
        );
    };

    const sortPedidosByDate = (pedidos) => {
        return pedidos.sort((a, b) => {
            const [yearA, monthA, dayA] = a.data.split('-').map(Number);
            const [yearB, monthB, dayB] = b.data.split('-').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateA - dateB;
        });
    };

    const handleSave = async (updatedPedido) => {
        try {
            console.log("Dados a serem enviados:", JSON.stringify(updatedPedido));
            const response = await fetch(`http://localhost:8080/registrar/atualizarPedido/${updatedPedido.idPaciente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPedido)
            });
    
            if (!response.ok) {
                console.error("Erro ao atualizar pedido no banco de dados:", await response.text());
            } else {
                console.log("Pedido atualizado com sucesso no banco de dados");
            }
        } catch (error) {
            console.error("Erro ao atualizar pedido no banco de dados:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="pedidos-list">
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        className="search-bar"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="pedidos-header">
                    <div className="status-header"></div>
                    <div className="pedido-paciente">Paciente</div>
                    <div className="pedido-data">Data do Procedimento</div>
                    <div className="pedido-hospital">Hospital</div>
                    <div className="pedido-tipo">Procedimento</div>
                    <div className="pedido-medico">Médico</div>
                </div>
                {visiblePedidos.map(pedido => (
                    <div
                        key={pedido.idPaciente}
                        className="pedido-item"
                        onClick={() => handlePedidoClick(pedido)}
                    >
                        <div className="status-container">
                            <span className={`status-indicator ${pedido.status}`}></span>
                        </div>
                        <div className="pedido-info">
                            <div className="pedido-paciente">
                                {pedido.paciente}
                                <span className="tooltip">{pedido.paciente}</span>
                            </div>
                            <div className="pedido-data">{pedido.data}</div>
                            <div className="pedido-hospital">{pedido.hospital}</div>
                            <div className="pedido-tipo">{pedido.tipo}</div>
                            <div className="pedido-medico">{pedido.medico}</div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedPedido && (
                <PedidoDetail 
                    pedido={selectedPedido} 
                    onClose={handleDetailClose} 
                    onDelete={(idPaciente, isFaturamento) => handleDelete(idPaciente, isFaturamento)}
                    onUpdate={handleUpdatePedido}
                />
            )}
            {alert.visible && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ ...alert, visible: false })}
                />
            )}
        </>
    );
};

export default PedidosList;
