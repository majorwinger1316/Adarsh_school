import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'; // Import the invoke function from Tauri
import "../styles/AddClass.css";
import ConfirmationDialog from '../Components/ConfirmationDialog'; // Import the custom confirmation dialog

function AddClass() {
    const [classNames, setClassNames] = useState([]);
    const [newClassName, setNewClassName] = useState(''); // State for new class name
    const [showDialog, setShowDialog] = useState(false); // State to show/hide the dialog
    const [pendingClassName, setPendingClassName] = useState(''); // State for the class name to be confirmed

    useEffect(() => {
        async function fetchClassNames() {
            try {
                const result = await invoke('fetch_classes'); // Invoke the fetch_classes Tauri command
                setClassNames(result.map(classObj => classObj.class_name));
            } catch (error) {
                console.error('Error fetching class names:', error);
            }
        }
        fetchClassNames();
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    const handleAddClass = async () => {
        if (newClassName.trim() === '') {
            return; // Don't add if the input is empty
        }

        setPendingClassName(newClassName); // Set the pending class name
        setShowDialog(true); // Show the confirmation dialog
    };

    const handleConfirmAddClass = async () => {
        setShowDialog(false); // Hide the dialog
        try {
            await invoke('add_class', { className: pendingClassName }); // Invoke the add_class Tauri command
            setClassNames([...classNames, pendingClassName]); // Update the state with the new class
            setNewClassName(''); // Clear the input field
            setPendingClassName(''); // Clear the pending class name
        } catch (error) {
            console.error('Error adding class:', error);
        }
    };

    const handleCancelAddClass = () => {
        setShowDialog(false); // Hide the dialog
        setPendingClassName(''); // Clear the pending class name
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
            </div>
            <div className='new_class'>
                <div>Class Name:</div>
                <input 
                    type="text" 
                    value={newClassName} 
                    onChange={(e) => setNewClassName(e.target.value)} // Update state on input change
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
