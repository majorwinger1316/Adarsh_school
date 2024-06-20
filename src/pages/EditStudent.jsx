import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import EditModal from './EditModal'; // Import EditModal component
import "../styles/EditStudent.css"

function EditStudent() {
    const [searchName, setSearchName] = useState('');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [editStudentData, setEditStudentData] = useState(null); // State to hold data for editing

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

    const handleEdit = (student) => {
        setEditStudentData(student);
    };

    const handleUpdateStudent = async (updatedData) => {
        try {
            await invoke('update_student', updatedData);
            console.log('Student updated successfully');
            fetchStudents(); // Refresh student list after update
            setEditStudentData(null); // Clear edit data after update
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const closeModal = () => {
        setEditStudentData(null);
    };

    return (
        <div className='search_stud'>
            <div className='title'>
                <p>Edit Student Record</p>
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
                <div className='stud_search_button'>
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>
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
                                        <button onClick={() => handleEdit(student)}>Edit</button>
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
            {editStudentData && (
                <EditModal
                    student={editStudentData}
                    onUpdate={handleUpdateStudent}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default EditStudent;
