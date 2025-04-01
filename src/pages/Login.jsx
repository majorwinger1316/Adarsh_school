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
  const hashedPassword = 'd74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1';

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
        const hashedInputPassword = "PASS"; // Replace with proper password hashing

        if (hashedInputPassword === "PASS") {
            if (!selectedSchema || selectedSchema === "Select Schema") {
                const currentYear = new Date().getFullYear().toString();
                
                console.log("Checking for current year schema...");
                let result;
                
                try {
                    result = await invoke("ensure_current_year_schema");
                    console.log("✅ Result from ensure_current_year_schema:", result);
                } catch (invokeError) {
                    console.error("❌ Error invoking ensure_current_year_schema:", invokeError);
                    alert(`Error invoking schema check: ${invokeError}`);
                    return;
                }

                if (result === "Schema Exists") {
                    console.warn("⚠️ Schema exists, prompting user to select a schema.");
                    alert("Current year schema already exists. Please select a schema.");
                } else if (result === "Schema Created" || result === "Ok") {
                    console.log("✅ Schema successfully created. Proceeding with login.");
                    setSelectedSchema(currentYear);
                    emit("login_successful", currentYear);
                    onLogin(currentYear);
                    navigate(`/home?schema=${currentYear}`);
                } else {
                    console.error("❌ Unexpected response:", result);
                    alert(`An error occurred: ${result}`);
                }
            } else {
                console.log("✅ Schema selected, proceeding with login.");
                emit("login_successful", selectedSchema);
                onLogin(selectedSchema);
                navigate(`/home?schema=${selectedSchema}`);
            }
        } else {
            console.error("❌ Invalid password.");
            alert("Invalid password. Please try again.");
        }
    } catch (error) {
        console.error("❌ Error during login:", error);
        alert(`Failed to perform login: ${error.message || error}`);
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
      <p>Welcome Back</p>
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
