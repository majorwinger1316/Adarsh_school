import React from 'react'
import "../styles/NewStudent.css"

function NewStudent() {
  return (
    <div className='newstudent'>
        <div className='title'>
            <p>New Student Record</p>
        </div>
        <div className='stud_cred'>
            <div className='stud_name'>
            <label>Name:</label>
            <input type="text" />
            </div>
            <div className='stud_dob'>
            <label>DOB:</label>
            <input type="date" />
            </div>
            <div className='stud_scholar'>
            <label>Scholar Number:</label>
            <input type="number" />
            </div>
            <div className='stud_class'>
            <label>Class:</label>
            <input type="text" />
            </div>
            <div className='stud_father'>
            <label>Father's Name:</label>
            <input type="text" />
            </div>
            <div className='stud_mother'>
            <label>Mother's Name:</label>
            <input type="text" />
            </div>
            <div className='stud_address'>
            <label>Address:</label>
            <input type="text" />
            </div>
            <div className='stud_number'>
            <label>Phone Number:</label>
            <input type="text" />
            </div>
        </div>
        <div className='stud_submit'>
            <button>Register</button>
        </div>
    </div>
  )
}

export default NewStudent
