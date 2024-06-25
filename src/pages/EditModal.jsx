import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

function EditModal({ student, onUpdate, onClose }) {
    const [editedData, setEditedData] = useState({ ...student });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

const handleUpdate = async () => {
    try {
        await invoke('update_student', {updatedStudent : editedData});
        console.log('Student updated successfully');
        alert("Record has been updated");
    } catch (error) {
        console.error('Error updating student:', error);
    }
};

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Student Record</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={editedData.name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input type="text" name="dob" value={editedData.dob} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Scholar Number:</label>
                        <input type="number" name="scholar_number" value={editedData.scholar_number} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Class:</label>
                        <input type="text" name="ClassName" value={editedData.ClassName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Father's Name:</label>
                        <input type="text" name="father_name" value={editedData.father_name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Mother's Name:</label>
                        <input type="text" name="mother_name" value={editedData.mother_name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input type="text" name="address" value={editedData.address} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input type="text" name="mobile_num" value={editedData.mobile_num} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <button onClick={handleUpdate}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
