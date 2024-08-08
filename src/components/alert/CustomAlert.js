import React, { useEffect} from 'react';
import './CustomAlert.css';

const CustomAlert = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`custom-alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>x</button>
        </div>
    );
};

export default CustomAlert;
