import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import { emit } from '@tauri-apps/api/event';
import "../styles/Login.css"
import * as CryptoJS from 'crypto-js';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [schemas, setSchemas] = useState([]);
  const hashedPassword = 'd74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1'; // Replace with your hashed password

  useEffect(() => {
    async function fetchSchemas() {
      try {
        const schemas = await invoke('fetch_schemas');
        setSchemas(schemas);
      } catch (error) {
        console.error('Failed to fetch schemas', error);
      }
    }

    fetchSchemas();
  }, []);

  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };

  const handleLogin = async () => {
    try {
      const hashedInputPassword = hashPassword(passwordInput);

      if (hashedInputPassword === hashedPassword && selectedSchema) {
        emit('login_successful', selectedSchema);
        onLogin(selectedSchema); // Call onLogin function provided by parent component (App)
        navigate(`/home?schema=${selectedSchema}`);
      } else {
        console.error('Invalid password or schema selection');
        alert('Invalid password or schema selection. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to perform login. Please try again later.');
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
  };

  const handleSchemaChange = (e) => {
    setSelectedSchema(e.target.value);
  };

  return (
    <div className="login-container">
      <div className='title'>
      <p>Login</p>
      </div>
      <div className="login-form">
        <input
          type="password"
          value={passwordInput}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <div className='schema_sel'>
        <select value={selectedSchema} onChange={handleSchemaChange}>
          <option value="">Select Schema</option>
          {schemas.map((schema, index) => (
            <option key={index} value={schema.Database}>
              {schema.Database}
            </option>
          ))}
        </select>
        </div>
        </div>
        <div className='login_submit'>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
