import React, { useState, useEffect } from 'react';
import "../styles/EditFeeModal.css";

function EditFeeModal({ fee, onUpdate, onClose }) {
    const [updatedFee, setUpdatedFee] = useState({ ...fee });

    // useEffect to update total_fee whenever other fee fields change
    useEffect(() => {
        const { admission_fee, tution_fee, exam_fee, annual_charges } = updatedFee;
        const total_fee = admission_fee + tution_fee + exam_fee + annual_charges;
        setUpdatedFee((prevFee) => ({
            ...prevFee,
            total_fee: total_fee
        }));
    }, [updatedFee.admission_fee, updatedFee.tution_fee, updatedFee.exam_fee, updatedFee.annual_charges]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedFee((prevFee) => ({
            ...prevFee,
            [name]: parseInt(value, 10)
        }));
    };

    const handleSubmit = () => {
        onUpdate(updatedFee);
    };

    return (
        <div className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>&times;</span>
                <div className='form-group'>
                    <label>Admission Fee</label>
                    <input
                        type="number"
                        name="admission_fee"
                        value={updatedFee.admission_fee}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-group'>
                    <label>Tuition Fee</label>
                    <input
                        type="number"
                        name="tution_fee"
                        value={updatedFee.tution_fee}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-group'>
                    <label>Exam Fee</label>
                    <input
                        type="number"
                        name="exam_fee"
                        value={updatedFee.exam_fee}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-group'>
                    <label>Annual Charges</label>
                    <input
                        type="number"
                        name="annual_charges"
                        value={updatedFee.annual_charges}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-group'>
                    <label>Total Fee</label>
                    <input
                        type="number"
                        name="total_fee"
                        value={updatedFee.total_fee}
                        readOnly // make total_fee field read-only
                    />
                </div>
                <div className='form-group'>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default EditFeeModal;
