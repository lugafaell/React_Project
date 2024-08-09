import React, { useState, useEffect } from 'react';
import './FaturamentoList.css';
import Navbar from '../../Navbar/Navbar';
import CustomAlert from '../../alert/CustomAlert';
import { useTransition, animated } from '@react-spring/web';
import FaturamentoDetails from '../FaturamentoDetails/FaturamentoDetails';

const FaturamentoList = () => {
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });
    const [faturamentoData, setFaturamentoData] = useState([]);
    const [selectedFaturamento, setSelectedFaturamento] = useState(null);

    useEffect(() => {
        const fetchFaturamentoData = async () => {
            try {
                const response = await fetch('http://localhost:8080/faturamento/receberFaturamento');
                const data = await response.json();
                setFaturamentoData(data);
            } catch (error) {
                console.error('Erro ao buscar faturamentos:', error);
            }
        };

        fetchFaturamentoData();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "FATURADO":
                return "status-billed";  
            default:
                return "status-pending";
        }
    };

    const transitions = useTransition(faturamentoData, {
        keys: item => item._id,
        from: { opacity: 0, transform: 'translateY(-20px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(-20px)' },
        trail: 300,
    });

    const handleRowClick = (item) => {
        setSelectedFaturamento(item);
    };

    const handleFaturamentoDelete = (deletedId) => {
        setFaturamentoData((prevData) => prevData.filter((item) => item._id !== deletedId));
        setSelectedFaturamento(null);
        setAlert({ message: 'Faturamento removido com sucesso!', type: 'success', visible: true });
    };

    const handleFaturamentoUpdate = (updatedFaturamento) => {
        setFaturamentoData((prevData) =>
            prevData.map((item) =>
                item._id === updatedFaturamento._id ? updatedFaturamento : item
            )
        );
        setSelectedFaturamento(updatedFaturamento);
    };

    return (
        <div>
            <Navbar />
            <div className="faturamento-container">
                <h2>Faturamento</h2>
                <table className="faturamento-table">
                    <thead>
                        <tr>
                            <th>Nome do Paciente</th>
                            <th>Data do Procedimento</th>
                            <th>Hospital</th>
                            <th>Status</th>
                            <th>Motivo</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transitions((style, item, t, index) => (
                            <animated.tr 
                                style={style} 
                                key={item._id} 
                                onClick={() => handleRowClick(item)}
                            >
                                <td>{item.nomePaciente}</td>
                                <td>{item.dataProcedimento}</td>
                                <td>{item.hospital}</td>
                                <td 
                                    className={getStatusClass(item.status)}
                                >
                                    <span>{item.status || '-'}</span>
                                </td>
                                <td>
                                    <span>{item.motivo || '-'}</span>
                                </td>
                                <td>{item.valorTotal}</td>
                            </animated.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {alert.visible && (
                <CustomAlert 
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ ...alert, visible: false })}
                />
            )}
            {selectedFaturamento && (
                <FaturamentoDetails 
                    faturamento={selectedFaturamento} 
                    onClose={() => setSelectedFaturamento(null)}
                    onDelete={handleFaturamentoDelete}
                    onUpdate={handleFaturamentoUpdate}
                />
            )}
        </div>
    );
};

export default FaturamentoList;