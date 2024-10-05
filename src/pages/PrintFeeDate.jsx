import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/PrintFeeDate.css"

function PrintFeeDate() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [feeRecords1, setFeeRecords1] = useState([]);

    const fetchDetailsByDateRange = async () => {
        try {
            const fees1 = await invoke('fetch_fee_by_date_range', { startDate, endDate });
            setFeeRecords1(fees1);
        } catch (error) {
            console.error('Failed to fetch details:', error);
        }
    };

    const printReceipt = () => {
        window.print();
    };

    return (
        <div className='print_using_date'>
            <div className='title'>
                <p>Print using Dates</p>
            </div>
            <div className='searching_stud'>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className='login_submit'>
                <button onClick={fetchDetailsByDateRange}>Fetch Details</button>
            </div>
            <div className='printing_area1'>
                <p>Adarsh Vidyalaya, 11/223 Souter Ganj, Uttar Pradesh - 208001</p>
                {feeRecords1.length > 0 && (
                    <div className='fee_details1'>
                        <p>Statement</p>
                        <table>
                            <thead>
                                <tr className='small'>
                                    <th>Date</th>
                                    <th>Invoice Number</th>
                                    <th>Admission Fee</th>
                                    <th>Tuition Fee</th>
                                    <th>Exam Fee</th>
                                    <th>Annual Charges</th>
                                    <th>Total Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeRecords1.map((record1, index) => (
                                    <tr key={record1.invoice_number} className='small'>
                                        <td>{record1.date}</td>
                                        <td>{record1.invoice_number}</td>
                                        <td>{record1.admission_fee}</td>
                                        <td>{record1.tution_fee}</td>
                                        <td>{record1.exam_fee}</td>
                                        <td>{record1.annual_charges}</td>
                                        <td>{record1.total_fee}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className='print_button'>
                <button onClick={printReceipt}>Print Receipt</button>
            </div>
        </div>
    );
}

export default PrintFeeDate;
