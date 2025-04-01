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
        // Hide everything except the printing area
        const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
        originalStyles.forEach(style => style.setAttribute('media', 'not print'));
        
        // Create print-specific styles
        const printStyle = document.createElement('style');
        printStyle.innerHTML = `
            @page { size: auto; margin: 5mm; }
            body { margin: 0; padding: 0; background: white; }
            .no-print { display: none !important; }
            table { page-break-inside: avoid; width: 100%; }
            tr { page-break-inside: avoid; }
            .printing_area1 { 
                position: relative; 
                left: 0; 
                top: 0; 
                width: 100%; 
                margin: 0; 
                padding: 0; 
                border: none; 
            }
            table th, table td { 
                padding: 2px 4px; 
                font-size: 10px; 
                height: auto; 
            }
        `;
        document.head.appendChild(printStyle);
        
        window.print();
        
        // Restore original styles
        originalStyles.forEach(style => style.removeAttribute('media'));
        printStyle.remove();
    };

    return (
        <div className='print_using_date'>
            <div className='title no-print'>
                <p>Print using Dates</p>
            </div>
            <div className='searching_stud no-print'>
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
            <div className='login_submit no-print'>
                <button onClick={fetchDetailsByDateRange}>Fetch Details</button>
            </div>
            <div className='printing_area1'>
                <p>Adarsh Vidyalaya, 11/223 Souter Ganj, Uttar Pradesh - 208001</p>
                {feeRecords1.length > 0 && (
                    <div className='fee_details1'>
                        <p>Statement</p>
                        <table>
                            <thead>
                                <tr>
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
                                {feeRecords1.map((record1) => (
                                    <tr key={record1.invoice_number}>
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
            <div className='print_button no-print'>
                <button onClick={printReceipt}>Print Receipt</button>
            </div>
        </div>
    );
}

export default PrintFeeDate;
