import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

function NewSession() {
    const [sessionName, setSessionName] = useState('');

    const handleStartSession = async () => {
        try {
            // Call Tauri backend function to start a new session
            await invoke('start_new_database_session', { sessionName });
            alert(`New database session '${sessionName}' started successfully!`);
            setSessionName(''); // Clear input after success
        } catch (error) {
            console.error('Error starting new session:', error);
            alert('Failed to start new session.');
        }
    };

    return (
        <div className='new_session'>
            <div className='title'>
                <p>New Session</p>
            </div>
            <div className='session_input'>
                <label>Session Name:</label>
                <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                />
            </div>
            <div className='session_button'>
                <button onClick={handleStartSession}>Start Session</button>
            </div>
        </div>
    );
}

export default NewSession;
