import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/NewFee.css";

function NewFee() {
    const [searchName, setSearchName] = useState('');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feeDetails, setFeeDetails] = useState({
        admissionFee: 0,
        tuitionFee: 0,
        examFee: 0,
        annualCharges: 0,
        totalFee: 0
    });

    const fetchStudents = async () => {
        try {
            const result = await invoke('search_students', { criteria: { name: searchName } });
            setStudents(result);
            setFilteredStudents(result);
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    const handleSearch = () => {
        fetchStudents();
    };

    const handleFeeClick = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setFeeDetails({
            admissionFee: 0,
            tuitionFee: 0,
            examFee: 0,
            annualCharges: 0,
            totalFee: 0
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeeDetails((prevDetails) => {
            const updatedDetails = {
                ...prevDetails,
                [name]: parseInt(value, 10) || 0
            };
            updatedDetails.totalFee = updatedDetails.admissionFee + updatedDetails.tuitionFee + updatedDetails.examFee + updatedDetails.annualCharges;
            return updatedDetails;
        });
    };

    const handleFormSubmit = async () => {
        try {
            const { admissionFee, tuitionFee, examFee, annualCharges, totalFee } = feeDetails;
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

            await invoke('add_fee', {
                feeDetails: {
                    scholar_number: selectedStudent.scholar_number,
                    admission_fee: admissionFee,
                    tution_fee: tuitionFee,
                    exam_fee: examFee,
                    annual_charges: annualCharges,
                    total_fee: totalFee,
                    date: currentDate
                }
            });

            handleModalClose();
            alert('Fee registered successfully!');

            // Optionally, you can fetch updated fee records after successful submission
            handleSearch();
        } catch (error) {
            console.error('Error adding fee:', error);
        }
    };

    return (
        <div className='newfee'>
            <div className='title'>
                <p>Fee Payment</p>
            </div>
            <div className='searching_stud'>
                <div className='search_name'>
                    <label>Search using Name:</label>
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
            </div>
            <div className='stud_search_button'>
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className='fee_payment'>
                <div className='stud_search_table'>
                    <table>
                        <thead>
                            <tr>
                                <th>S. No.</th>
                                <th>Name</th>
                                <th>DOB</th>
                                <th>Scholar Number</th>
                                <th>Class</th>
                                <th>Father's Name</th>
                                <th>Mother's Name</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.dob}</td>
                                        <td>{student.scholar_number}</td>
                                        <td>{student.ClassName}</td>
                                        <td>{student.father_name}</td>
                                        <td>{student.mother_name}</td>
                                        <td>{student.address}</td>
                                        <td>{student.mobile_num}</td>
                                        <td>
                                            <button onClick={() => handleFeeClick(student)}>Fee</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10">No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <span className='close' onClick={handleModalClose}>&times;</span>
                        <div className='form-group'>
                            <label>Admission Fee</label>
                            <input
                                type="number"
                                name="admissionFee"
                                value={feeDetails.admissionFee}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Tuition Fee</label>
                            <input
                                type="number"
                                name="tuitionFee"
                                value={feeDetails.tuitionFee}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Exam Fee</label>
                            <input
                                type="number"
                                name="examFee"
                                value={feeDetails.examFee}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Annual Charges</label>
                            <input
                                type="number"
                                name="annualCharges"
                                value={feeDetails.annualCharges}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Total Fee</label>
                            <input
                                type="number"
                                name="totalFee"
                                value={feeDetails.totalFee}
                                readOnly
                            />
                        </div>
                        <div className='form-group'>
                            <button onClick={handleFormSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewFee;
