import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

function SearchFee() {
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

    return (
        <div className='edit_fee'>
          <div className='title'>
            <p>Search Fee Record</p>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
    
        </div>
      )
}

export default SearchFee
