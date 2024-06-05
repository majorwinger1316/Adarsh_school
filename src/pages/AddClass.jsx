import React from 'react'
import "../styles/AddClass.css"

function AddClass() {
  return (
    <div className='addclass'>
      <div className='title'>
        <p>Add a Class</p>
      </div>
      <div className='class_table'>
        <table>
            <thead>
                <tr>
                    <th>Classes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
      </div>
      <div className='new_class'>
        <div>Class Name:</div>
        <input type="number" />
      </div>
      <div className='class_submit'>
            <button>Add</button>
        </div>
    </div>
  )
}

export default AddClass
