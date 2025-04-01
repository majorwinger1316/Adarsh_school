import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

function EditClassModal({ oldClassName, onUpdate, onClose }) {
    const [newClassName, setNewClassName] = useState(oldClassName);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setNewClassName(e.target.value);
        setError(''); // Clear error when user types
    };

    const handleSubmit = async () => {
        if (!newClassName.trim()) {
            setError('Class name cannot be empty');
            return;
        }

        if (newClassName === oldClassName) {
            onClose();
            return;
        }

        setIsUpdating(true);
        setError('');

        try {
            await invoke('update_class_name', {
                update: {
                    old_class_name: oldClassName,
                    new_class_name: newClassName
                }
            });
            await onUpdate();
            onClose();
        } catch (error) {
            if (error.includes('1451')) {
                setError('Cannot update class name because it has students assigned. Please contact admin.');
            } else {
                setError(`Failed to update: ${error}`);
            }
        }
    };

    return (
        <div className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>&times;</span>
                <h2>Edit Class Name</h2>
                
                <div className='form-group'>
                    <label>Current Name:</label>
                    <input
                        type="text"
                        value={oldClassName}
                        readOnly
                    />
                </div>

                <div className='form-group'>
                    <label>New Name:</label>
                    <input
                        type="text"
                        value={newClassName}
                        onChange={handleInputChange}
                        disabled={isUpdating}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className='form-actions'>
                    <button 
                        onClick={handleSubmit}
                        disabled={isUpdating || !newClassName.trim()}
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditClassModal;
