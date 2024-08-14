import React, { useState, useEffect } from 'react';
import './EmployeeList.css';
import Navbar from '../Navbar/Navbar';
import { FaPencilAlt, FaTrashAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [showPasswords, setShowPasswords] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:8080/auth/users');
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
            }
        };

        fetchEmployees();
    }, []);

    const togglePasswordVisibility = (id) => {
        setShowPasswords((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(employees.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="employee-list-container">
            <Navbar />
            <h2>Lista de Funcionários</h2>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Nome do Funcionário</th>
                        <th>Cargo</th>
                        <th>Estado</th>
                        <th>Senha de Login</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((employee, index) => (
                        <tr key={employee._id} style={{ '--animation-order': index + 1 }}>
                            <td>{employee.username}</td>
                            <td>{employee.cargo}</td>
                            <td>{employee.cargo}</td>
                            <td className="password-field">
                                {showPasswords[employee._id] ? '123' : '********'}
                                <button
                                    className="toggle-password-btn"
                                    onClick={() => togglePasswordVisibility(employee._id)}
                                    aria-label={showPasswords[employee._id] ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPasswords[employee._id] ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </td>
                            <td>
                                <div className="actions">
                                    <button className="edit-btn" aria-label="Editar">
                                        <FaPencilAlt />
                                    </button>
                                    <button className="delete-btn" aria-label="Excluir">
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <button className="pagination-number active">
                    {currentPage}
                </button>
                <button
                    className="pagination-arrow"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default EmployeeList;
