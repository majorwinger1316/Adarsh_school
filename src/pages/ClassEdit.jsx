import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'; // Import the invoke function from Tauri
import "../styles/ClassEdit.css";
import EditClassModal from '../Components/EditClassModal'; // Import EditClassModal component

function ClassEdit() {
    const [classNames, setClassNames] = useState([]);
    const [editClassName, setEditClassName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function fetchClassNames() {
            try {
                const result = await invoke('fetch_classes'); // Invoke the fetch_classes Tauri command
                setClassNames(result);
            } catch (error) {
                console.error('Error fetching class names:', error);
            }
        }
        fetchClassNames();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditClassName('');
    };

    const handleEdit = (index) => {
        setEditClassName(classNames[index].class_name);
        openModal();
    };

    const handleUpdateClassName = async () => {
        try {
            await invoke('update_class_name', {
                updateDetails: {
                    old_class_name: editClassName,
                    new_class_name: editClassName // Change this if needed
                }
            });
            closeModal();
            const updatedClasses = classNames.map(classObj =>
                classObj.class_name === editClassName ? { ...classObj, class_name: editClassName } : classObj
            );
            setClassNames(updatedClasses);
            alert('Class name updated successfully!');
        } catch (error) {
            console.error('Error updating class name:', error);
            alert('Failed to update class name.');
        }
    };

    return (
        <div className='class_edit'>
            <div className='title'>
                <p>Edit Class Name</p>
            </div>
            <div className='class_table'>
                <table>
                    <thead>
                        <tr>
                            <th>Classes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classNames.map((classObj, index) => (
                            <tr key={index}>
                                <td>{classObj.class_name}</td>
                                <td>
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <EditClassModal
                    oldClassName={editClassName}
                    onUpdate={handleUpdateClassName}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default ClassEdit;
