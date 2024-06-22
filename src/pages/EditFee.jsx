import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/EditFee.css";
import EditFeeModal from '../Components/EditFeeModal'; // Import EditFeeModal component

function EditFee() {
    const [scholarNumber, setScholarNumber] = useState('');
    const [feeRecords, setFeeRecords] = useState([]);
    const [editFeeData, setEditFeeData] = useState(null);

    const handleSearch = async () => {
        try {
            const result = await invoke('fetch_fee_by_scholar_number', { scholarNumber: parseInt(scholarNumber, 10) });
            setFeeRecords(result);
        } catch (error) {
            console.error('Error fetching fee records:', error);
            alert('Failed to fetch fee records.');
        }
    };

    const handleEdit = (fee) => {
        setEditFeeData(fee);
    };

    const handleUpdateFee = async (updatedFee) => {
        try {
            await invoke('update_fee', { updatedFee });
            setEditFeeData(null);
            handleSearch(); // Refresh the fee records after update
            alert('Fee record updated successfully!');
        } catch (error) {
            console.error('Error updating fee record:', error);
        }
    };

    const closeModal = () => {
        setEditFeeData(null);
    };

    return (
        <div className='edit_fee'>
            <div className='title'>
                <p>Edit Fee Record</p>
            </div>
            <div className='searching_stud'>
                <div className='search_scholar'>
                    <label>Search using Scholar Number:</label>
                    <input
                        type="number"
                        value={scholarNumber}
                        onChange={(e) => setScholarNumber(e.target.value)}
                    />
                </div>
            </div>
            <div className='stud_search_button'>
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className='fee_search_table'>
                <table>
                    <thead>
                        <tr>
                            <th>S. No.</th>
                            <th>Invoice Number</th>
                            <th>Scholar Number</th>
                            <th>Admission Fee</th>
                            <th>Tuition Fee</th>
                            <th>Exam Fee</th>
                            <th>Annual Charges</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feeRecords.map((record, index) => (
                            <tr key={record.invoice_number}>
                                <td>{index + 1}</td>
                                <td>{record.invoice_number}</td>
                                <td>{record.scholar_number}</td>
                                <td>{record.admission_fee}</td>
                                <td>{record.tution_fee}</td>
                                <td>{record.exam_fee}</td>
                                <td>{record.annual_charges}</td>
                                <td>{record.total_fee}</td>
                                <td>{record.date}</td>
                                <td>
                                    <button onClick={() => handleEdit(record)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editFeeData && (
                <EditFeeModal
                    fee={editFeeData}
                    onUpdate={handleUpdateFee}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default EditFee;
