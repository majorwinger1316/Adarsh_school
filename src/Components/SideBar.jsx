import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EditIcon from '@mui/icons-material/Edit';
import FeedIcon from '@mui/icons-material/Feed';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PageviewIcon from '@mui/icons-material/Pageview';
import PrintIcon from '@mui/icons-material/Print';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import '../styles/SideBar.css';

function SideBar() {
  return (
    <div className='sidebar'>
      <div className='greet'>
        <p>Dashboard</p>
      </div>
      <div className='links'>
        <li><Link to="/home" className="button"><HomeIcon/>Home</Link></li>
        <li><Link to="/new_stud" className="button1"><PersonAddIcon/>New Admission</Link></li>
        <li><Link to="/stud_search" className='button'><PersonSearchIcon/>Search for a Student</Link></li>
        <li><Link to="/stud_edit" className='button'><EditIcon/>Edit a Student record</Link></li>
        <li><Link to="/new_fee" className='button1'><FeedIcon/>Record Fee Payment</Link></li>
        <li><Link to="/edit_fee" className='button'><EditNoteIcon/>Edit a Fee Payment</Link></li>
        <li><Link to="/search_fee" className='button'><FindInPageIcon/>Search a Fee Payment</Link></li>
        <li><Link to="/class_add" className='button1'><NoteAddIcon/>Add a Class</Link></li>
        <li><Link to="/class_edit" className='button'><BorderColorIcon/>Edit Class name</Link></li>
        <li><Link to="/class_search" className='button'><PageviewIcon/>Find Class Records</Link></li>
        <li><Link to="/print_fee" className='button1'><PrintIcon/>Print Fee slip</Link></li>
        <li><Link to="/stud_delete" className='button2'><PersonRemoveIcon/>Delete Student Record</Link></li>
        <li><Link to="/delete_fee" className='button2'><DeleteIcon/>Delete a Fee Record</Link></li>
        <li><Link to="/new_database" className='button'><AddIcon/>New Session</Link></li>
        <li><Link to="/" className='button3'><LogoutIcon/>Logout</Link></li>
      </div>
    </div>
  );
}

export default SideBar;
