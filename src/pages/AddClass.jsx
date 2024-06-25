import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/AddClass.css";
import ConfirmationDialog from '../Components/ConfirmationDialog';

function AddClass() {
  const [classNames, setClassNames] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [pendingClassName, setPendingClassName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClassNames() {
      try {
        setIsLoading(true);
        const result = await invoke('fetch_classes');
        console.log('Fetched class names:', result); // Add logging
        setClassNames(result.map(classObj => classObj.class_name));
        setIsLoading(false);
      } catch (error) {
        setErrorMessage('Error fetching class names: ' + error.message); // Improved error message
        setIsLoading(false);
      }
    }
    fetchClassNames();
  }, []);

  const handleAddClass = async () => {
    if (newClassName.trim() === '') {
      return;
    }

    setPendingClassName(newClassName);
    setShowDialog(true);
  };

  const handleConfirmAddClass = async () => {
    setShowDialog(false);
    try {
      setIsLoading(true);
      await invoke('add_class', { className: pendingClassName });
      setClassNames([...classNames, pendingClassName]);
      setNewClassName('');
      setPendingClassName('');
      setIsLoading(false);
    } catch (error) {
      setErrorMessage('Error adding class: ' + error.message); // Improved error message
      setClassNames(classNames.filter(name => name !== pendingClassName));
      setIsLoading(false);
    }
  };

  const handleCancelAddClass = () => {
    setShowDialog(false);
    setPendingClassName('');
  };

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
            {classNames.map((className, index) => (
              <tr key={index}>
                <td>{className}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {isLoading && <div>Loading...</div>}
      </div>
      <div className='new_class'>
        <div>Class Name:</div>
        <input 
          type="text" 
          value={newClassName} 
          onChange={(e) => setNewClassName(e.target.value)} 
        />
      </div>
      <div className='class_submit'>
        <button onClick={handleAddClass}>Add</button>
      </div>
      {showDialog && (
        <ConfirmationDialog 
          message={`Are you sure you want to add the class: ${pendingClassName}?`}
          onConfirm={handleConfirmAddClass}
          onCancel={handleCancelAddClass}
        />
      )}
    </div>
  );
}

export default AddClass;
