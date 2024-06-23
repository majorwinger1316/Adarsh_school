import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'; // Import the invoke function from Tauri

function EditClassModal({ oldClassName, onUpdate, onClose }) {
    const [newClassName, setNewClassName] = useState(oldClassName);

    const handleInputChange = (e) => {
        setNewClassName(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const updateDetails = {
                old_class_name: oldClassName,
                new_class_name: newClassName
            };

            await invoke('update_class_name', { updateDetails });

            onUpdate(); // Trigger parent component update
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating class name:', error);
            alert('Failed to update class name.');
        }
    };

    return (
        <div className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>&times;</span>
                <div className='form-group'>
                    <label>Edit Class Name:</label>
                    <input
                        type="text"
                        value={newClassName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-group'>
                    <button onClick={handleSubmit}>Update</button>
                </div>
            </div>
        </div>
    );
}

export default EditClassModal;
