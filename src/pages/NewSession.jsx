import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import "../styles/NewSession.css"

function NewSession() {
    const [sessionName, setSessionName] = useState('');
    const [error, setError] = useState(null); // State to store error messages

    const handleStartSession = async () => {
        setError(null); // Clear previous error messages

        try {
            await invoke('create_tables_in_schema', { schemaName: sessionName });
            alert(`New database session '${sessionName}' started successfully!`);
            setSessionName(''); // Clear input after success
        } catch (error) {
            console.error('Error starting new session:', error);
            setError('Failed to start new session. Please try again.'); // Set error message
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
