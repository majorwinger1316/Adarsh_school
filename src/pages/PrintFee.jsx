import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/PrintFee.css";

function PrintFee() {
  const [scholarNumber, setScholarNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [feeRecords, setFeeRecords] = useState([]);
  const [feeRecords1, setFeeRecords1] = useState([]);

  const fetchDetailsByScholarNumber = async () => {
    try {
      const student = await invoke('fetch_student_by_scholar_number', { scholarNumber: parseInt(scholarNumber, 10) });
      const fees = await invoke('fetch_fee_by_scholar_number', { scholarNumber: parseInt(scholarNumber, 10) });
      setStudentDetails(student);
      setFeeRecords(fees);
    } catch (error) {
      console.error('Failed to fetch details:', error);
    }
  };

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
    <div className='print_fee'>
      <div className='print_using_scholar'>
        <div className='title'>
          <p>Print using Scholar Number</p>
        </div>
        <div className='searching_stud'>
          <input
            type="number"
            value={scholarNumber}
            onChange={(e) => setScholarNumber(e.target.value)}
            placeholder="Enter Scholar Number"
          />
        </div>
        <div className='login_submit'>
          <button onClick={fetchDetailsByScholarNumber}>Fetch Details</button>
        </div>
        <div className='printing_area'>
          <p>Adarsh Vidyalaya, 11/223 Souter Ganj, Uttar Pradesh - 208001</p>
          <p>Student Details</p>
          {studentDetails && (
            <div className='student_details'>
              <div className='student_details_left'>
                <p>{studentDetails.name}</p>
                <p>{studentDetails.dob}</p>
                <p>{studentDetails.scholar_number}</p>
                <p>{studentDetails.ClassName}</p>
              </div>
              <div className='student_details_right'>
                <p>{studentDetails.father_name}</p>
                <p>{studentDetails.mother_name}</p>
                <p>{studentDetails.address}</p>
                <p>{studentDetails.mobile_num}</p>
              </div>
            </div>
          )}
          {feeRecords.length > 0 && (
            <div className='fee_details'>
              <table className='center'>
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
                  {feeRecords.map((record) => (
                    <tr key={record.invoice_number}>
                        <td>{record.date}</td>
                        <td>{record.invoice_number}</td>
                        <td>{record.admission_fee}</td>
                        <td>{record.tution_fee}</td>
                        <td>{record.exam_fee}</td>
                        <td>{record.annual_charges}</td>
                        <td>{record.total_fee}</td>
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
    </div>
  );
}

export default PrintFee;
