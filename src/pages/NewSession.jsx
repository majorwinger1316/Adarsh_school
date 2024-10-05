import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/NewSession.css";

function NewSession() {
    const [sessionName, setSessionName] = useState('');
    const [error, setError] = useState(null); // State to store error messages

    const handleStartSession = async () => {
        try {
            // Validate session name (year)
            if (!sessionName) {
                setError('Session name cannot be empty');
                return;
            }

            // Call backend to create new schema (database)
            const response = await invoke('create_new_schema', { newSchemaName: sessionName });

            // Handle success response
            if (response.success) {
                alert(`New session (${sessionName}) created successfully!`);
                setError(null); // Clear any previous errors
            } else {
                setError(response.message || 'Failed to create new session');
            }
        } catch (error) {
            console.error('Error creating new session:', error);
            setError('Failed to perform operation. Please try again later.');
        }
    };

    return (
        <div className='new_session'>
            <div className='title'>
                <p>New Session</p>
            </div>
            <div className='searching_stud'>
                <label>Session Name:</label>
                <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                />
            </div>
            {error && (
                <div className='error_message'>
                    <p>{error}</p>
                </div>
            )}
            <div className='login_submit'>
                <button onClick={handleStartSession}>
                    New Session
                </button>
            </div>
        </div>
    );
}

export default NewSession;
