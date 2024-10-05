import React, { useState } from 'react';
import "../styles/SearchStudent.css";
import { invoke } from '@tauri-apps/api/tauri';

function SearchStudent() {
    const [searchName, setSearchName] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await invoke('search_students', { criteria: { name: searchName } });
            setFilteredStudents(response);
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    return (
        <div className='search_stud'>
            <div className='title'>
                <p>Search Student Record</p>
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
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{new Date(student.dob).toLocaleDateString()}</td>
                                    <td>{student.scholar_number}</td>
                                    <td>{student.ClassName}</td>
                                    <td>{student.father_name}</td>
                                    <td>{student.mother_name}</td>
                                    <td>{student.address}</td>
                                    <td>{student.mobile_num}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SearchStudent;
