import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import '../styles/DeleteFee.css';

function DeleteFee() {
    const [scholarNumber, setScholarNumber] = useState('');
    const [feeRecords, setFeeRecords] = useState([]);

    const handleSearch = async () => {
        try {
            const result = await invoke('fetch_fee_by_scholar_number', { scholarNumber: parseInt(scholarNumber, 10) });
            setFeeRecords(result);
        } catch (error) {
            console.error('Error fetching fee records:', error);
            alert('Failed to fetch fee records.');
        }
    };

    const handleDelete = async (invoiceNumber) => {
        try {
            await invoke('delete_fee', {invoiceNumber: invoiceNumber}); // Ensure 'invoiceNumber' is correctly passed
            // After deletion, refresh the fee records list or update state accordingly
            const updatedRecords = feeRecords.filter(record => record.invoice_number !== invoiceNumber);
            setFeeRecords(updatedRecords);
            alert('Fee record deleted successfully.');
        } catch (error) {
            console.error('Error deleting fee record:', error);
            alert('Failed to delete fee record.');
        }
    };

    return (
        <div className='delete_fee'>
            <div className='title'>
                <p>Delete a Fee Record</p>
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
            <div className='fee_delete_table'>
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
                                    <button onClick={() => handleDelete(record.invoice_number)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DeleteFee;
