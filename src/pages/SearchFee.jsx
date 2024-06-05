import React from 'react'

function SearchFee() {
    return (
        <div className='edit_fee'>
          <div className='title'>
            <p>Search Fee Record</p>
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
                <div className='fee_search_table'>
                    <table>
                        <thead>
                            <tr>
                                <th>S. No.</th>
                                <th>Invoice Number</th>
                                <th>Scholar Number</th>
                                <th>Date</th>
                                <th>Admission Fee</th>
                                <th>Tution Fee</th>
                                <th>Exam Fee</th>
                                <th>Annual Charges</th>
                                <th>Total</th>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
    
        </div>
      )
}

export default SearchFee
