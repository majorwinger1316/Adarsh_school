import React from 'react';
import "../styles/ConfirmationDialog.css";

function ConfirmationDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="confirmation-dialog">
            <div className="confirmation-dialog-content">
                <p>{message}</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
}

export default ConfirmationDialog;
