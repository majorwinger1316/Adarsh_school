import React from 'react'
import "../styles/EditStudent.css"

function EditStudent() {
    return (
        <div className='search_stud'>
            <div className='title'>
                <p>Edit Student Record</p>
            </div>
            <div className='searching_stud'>
                <div className='search_name'>
                <label>Search using Name:</label>
                <input type="text" />
                </div>
                <p>OR</p>
                <div className='search_scholar'>
                <label>Search using Scholar Number:</label>
                <input type="number" />
                </div>
                <p>OR</p>
                <div className='search_DOB'>
                <label>Search using DOB:</label>
                <input type="date" />
                </div>
            </div>
            <div className='stud_search_button'>
                <button>Search</button>
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
                        <tr>
                            <td>1</td>
                            <td>Akshat Dutt Kaushik</td>
                            <td>13/01/2003</td>
                            <td>12003</td>
                            <td>5</td>
                            <td>Hemendra Dutt Kaushik</td>
                            <td>Anju Kaushik</td>
                            <td>11/223 Souter Ganj, Kanpur</td>
                            <td>9455276501</td>
                            <td>
                                <button>Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      )
}

export default EditStudent
