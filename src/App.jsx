import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import About from './pages/About';
import Home from './pages/Home';
import SideBar from './Components/SideBar';
import NewStudent from './pages/NewStudent';
import SearchStudent from './pages/SearchStudent';
import NewFee from './pages/NewFee';
import EditFee from './pages/EditFee';
import EditStudent from './pages/EditStudent';
import SearchFee from './pages/SearchFee';
import AddClass from './pages/AddClass';
import ClassSearch from './pages/ClassSearch';
import ClassEdit from './pages/ClassEdit';
import DeleteStudent from './pages/DeleteStudent';
import DeleteFee from './pages/DeleteFee';
import NewSession from './pages/NewSession';
import PrintFee from './pages/PrintFee';
import PrintFeeDate from './pages/PrintFeeDate';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (selectedSchema) => {
    setIsLoggedIn(true);
    // Optionally, you can store the selected schema in localStorage or a state variable
    // This depends on how you want to manage the selected schema throughout the app
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <SideBar onLogout={handleLogout} />} {/* Render SideBar only if logged in */}
        <div className="content">
          <Routes>
            <Route path='/' element={<Login onLogin={handleLogin} />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/new_stud" element={<NewStudent />} />
            <Route path="/stud_search" element={<SearchStudent />} />
            <Route path="/stud_edit" element={<EditStudent />} />
            <Route path="/search_fee" element={<SearchFee />} />
            <Route path="/new_fee" element={<NewFee />} />
            <Route path="/edit_fee" element={<EditFee />} />
            <Route path="/class_add" element={<AddClass />} />
            <Route path="/class_search" element={<ClassSearch />} />
            <Route path="/class_edit" element={<ClassEdit />} />
            <Route path="/stud_delete" element={<DeleteStudent />} />
            <Route path="/delete_fee" element={<DeleteFee />} />
            <Route path="/new_database" element={<NewSession />} />
            <Route path="/print_fee" element={<PrintFee />} />
            <Route path="/print_fee_date" element={<PrintFeeDate />} />
            {/* If not logged in, navigate to '/' */}
            {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
