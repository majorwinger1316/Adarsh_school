import React from 'react'
import "../styles/NewFee.css"

function NewFee() {
  return (
    <div className='newfee'>
        <div className='title'>
            <p>Fee Payment</p>
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
        <div className='fee_payment'>
            <div className='admission_fee'>
                <label>Admisson Fee</label>
                <input type="number" />
            </div>
            <div className='tution_fee'>
                <label>Tution Fee</label>
                <input type="number" />
            </div>
            <div className='exam_fee'>
                <label>Exam Fee</label>
                <input type="number" />
            </div>
            <div className='annual_charges'>
                <label>Annual Charges</label>
                <input type="number" />
            </div>
            <div className='total_fee'>
                <label>Total Fee</label>
                <input type="number" />
            </div>
        </div>
        <div className='stud_search_button'>
                <button>Add</button>
            </div>
    </div>
  )
}

export default NewFee
