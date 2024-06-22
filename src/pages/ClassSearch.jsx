import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'; // Import Tauri invoke method
import '../styles/ClassSearch.css';

function ClassSearch() {
    const [className, setClassName] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    const handleSearch = async () => {
        try {
            const result = await invoke('fetch_students_by_class', { criteria: { name: className } });
            setFilteredStudents(result);
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Failed to fetch students.');
        }
    };

    return (
        <div className='class_search'>
            <div className='title'>
                <p>Search Class Records</p>
            </div>
            <div className='new_class'>
                <div>Class Name:</div>
                <input 
                    type="text" 
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                />
            </div>
            <div className='class_submit'>
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
                                <tr key={student.scholar_number}>
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

export default ClassSearch;
