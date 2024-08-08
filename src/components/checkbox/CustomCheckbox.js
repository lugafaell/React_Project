import React from 'react';
import './CustomCheckbox.css';

const CustomCheckbox = ({ checked, onChange }) => {
    return (
        <div className="custom-checkbox-container">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="custom-checkbox"
            />
        </div>
    );
};

export default CustomCheckbox;
