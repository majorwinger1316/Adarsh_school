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
import ClassSearch from './pages/ClassSearch';
import ClassEdit from './pages/ClassEdit';
import DeleteStudent from './pages/DeleteStudent';
import DeleteFee from './pages/DeleteFee';
import NewSession from './pages/NewSession';
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
            <Route path="/class_search" element={<ClassSearch />} />
            <Route path="/class_edit" element={<ClassEdit />} />
            <Route path="/stud_delete" element={<DeleteStudent />} />
            <Route path="/delete_fee" element={<DeleteFee />} />
            <Route path="/new_database" element={<NewSession />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
