import React, { useEffect, useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/NewStudent.css";

function NewStudent() {
    const [classNames, setClassNames] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        scholar_number: '',
        ClassName: '',
        father_name: '',
        mother_name: '',
        address: '',
        mobile_num: ''
    });

    const inputRefs = useRef([]);

    useEffect(() => {
        async function fetchClassNames() {
            try {
                const result = await invoke('fetch_classes');
                setClassNames(result.map(classObj => classObj.class_name));
            } catch (error) {
                console.error('Error fetching class names:', error);
            }
        }
        fetchClassNames();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = async () => {
        if (window.confirm('Are you sure you want to submit the form?')) {
            try {
                const formattedData = {
                    ...formData,
                    scholar_number: parseInt(formData.scholar_number, 10),
                    mobile_num: formData.mobile_num
                };
                await invoke('add_student', { student: formattedData });
                alert('Student registered successfully!');
            } catch (error) {
                console.error('Error registering student:', error);
                alert('Failed to register student.');
            }
        }
    };

    return (
        <div className='newstudent'>
            <div className='title'>
                <p>New Student Record</p>
            </div>
            <div className='stud_cred'>
                <div className='stud_name'>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 0)}
                        ref={(el) => inputRefs.current[0] = el}
                    />
                </div>
                <div className='stud_dob'>
                    <label>DOB:</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                        ref={(el) => inputRefs.current[1] = el}
                    />
                </div>
                <div className='stud_scholar'>
                    <label>Scholar Number:</label>
                    <input
                        type="number"
                        name="scholar_number"
                        value={formData.scholar_number}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 2)}
                        ref={(el) => inputRefs.current[2] = el}
                    />
                </div>
                <div className='stud_class'>
                    <label>Class:</label>
                    <select
                        name="ClassName"
                        value={formData.ClassName}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 3)}
                        ref={(el) => inputRefs.current[3] = el}
                    >
                        <option value="">Select Class</option>
                        {classNames.map((class_name, index) => (
                            <option key={index} value={class_name}>{class_name}</option>
                        ))}
                    </select>
                </div>
                <div className='stud_father'>
                    <label>Father's Name:</label>
                    <input
                        type="text"
                        name="father_name"
                        value={formData.father_name}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 4)}
                        ref={(el) => inputRefs.current[4] = el}
                    />
                </div>
                <div className='stud_mother'>
                    <label>Mother's Name:</label>
                    <input
                        type="text"
                        name="mother_name"
                        value={formData.mother_name}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 5)}
                        ref={(el) => inputRefs.current[5] = el}
                    />
                </div>
                <div className='stud_address'>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 6)}
                        ref={(el) => inputRefs.current[6] = el}
                    />
                </div>
                <div className='stud_number'>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="mobile_num"
                        value={formData.mobile_num}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, 7)}
                        ref={(el) => inputRefs.current[7] = el}
                    />
                </div>
            </div>
            <div className='stud_submit'>
                <button onClick={handleSubmit}>Register</button>
            </div>
        </div>
    );
}

export default NewStudent;
