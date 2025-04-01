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

    const handleUpdateClassName = async (newClassName) => {
        try {
          await invoke('update_class_name', {
            update: {
              old_class_name: editClassName,
              new_class_name: newClassName
            }
          });
          
          closeModal();
          
          // Refresh the class list
          const result = await invoke('fetch_classes');
          setClassNames(result);
          
          alert('Class name updated successfully!');
        } catch (error) {
          console.error('Error updating class name:', error);
          alert('Failed to update class name: ' + error);
        }
      };

      const handleUpdate = async () => {
        try {
            const result = await invoke('fetch_classes');
            setClassNames(result);
        } catch (error) {
            console.error('Error refreshing classes:', error);
            alert('Failed to refresh class list');
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
                    onUpdate={handleUpdate}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default ClassEdit;
