import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/DeleteStudent.css";
import ConfirmationDialog from '../Components/ConfirmationDialog'; // Adjust the import path if necessary

function DeleteStudent() {
    const [searchName, setSearchName] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null); // Track which student to delete

    useEffect(() => {
        fetchStudents();
    }, []); // Fetch students when component mounts

    const fetchStudents = async () => {
        try {
            const result = await invoke('search_students', { criteria: { name: searchName } });
            setStudents(result);
            setFilteredStudents(result);
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    const handleSearch = async () => {
        fetchStudents();
    };

    const handleDelete = async (scholarNumber) => {
        setStudentToDelete(scholarNumber);
        setShowDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await invoke('delete_student', { scholarNumber: studentToDelete });
            setShowDialog(false);
            fetchStudents(); // Refresh the student list after deletion
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student.');
        }
    };

    const handleCancelDelete = () => {
        setShowDialog(false);
        setStudentToDelete(null); // Clear the studentToDelete state
    };

    return (
        <div className='delete_student'>
            <div className='title'>
                <p>Delete a Student Record</p>
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
            <div className='stud_delete_table'>
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
                                        <button onClick={() => handleDelete(student.scholar_number)}>Delete</button>
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
            {showDialog && (
                <ConfirmationDialog
                    message={`Are you sure you want to delete this student record?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    )
}

export default DeleteStudent;
