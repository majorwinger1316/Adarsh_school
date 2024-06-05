import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import About from './pages/About';
import Home from './pages/home';
import SideBar from './Components/SideBar';
import NewStudent from './pages/NewStudent';
import SearchStudent from './pages/SearchStudent';
import NewFee from './pages/NewFee';
import EditFee from './pages/EditFee';
import EditStudent from './pages/EditStudent';
import SearchFee from './pages/SearchFee';
import AddClass from './pages/AddClass';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <SideBar />
        <div className="content">
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/new_stud" element={<NewStudent />} />
            <Route path="/stud_search" element={<SearchStudent />} />
            <Route path="/stud_edit" element={<EditStudent />} />
            <Route path="/search_fee" element={<SearchFee />} />
            <Route path="/new_fee" element={<NewFee />} />
            <Route path="/edit_fee" element={<EditFee />} />
            <Route path="/class_add" element={<AddClass />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
