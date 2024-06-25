import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSchema = queryParams.get('schema'); // Get the selected schema from query parameter

  // Function to render schema-based links
  const renderSchemaLinks = () => {
    if (!selectedSchema) return null; // Render nothing if no schema selected

    return (
      <>
        <li><Link to={`/home?schema=${selectedSchema}`} className="button"><HomeIcon />Home</Link></li>
        <li><Link to={`/new_stud?schema=${selectedSchema}`} className="button1"><PersonAddIcon />New Admission</Link></li>
        <li><Link to={`/stud_search?schema=${selectedSchema}`} className='button'><PersonSearchIcon />Search for a Student</Link></li>
        <li><Link to={`/stud_edit?schema=${selectedSchema}`} className='button'><EditIcon />Edit a Student record</Link></li>
        <li><Link to={`/new_fee?schema=${selectedSchema}`} className='button1'><FeedIcon />Record Fee Payment</Link></li>
        <li><Link to={`/search_fee?schema=${selectedSchema}`} className='button'><FindInPageIcon />Search a Fee Payment</Link></li>
        <li><Link to={`/edit_fee?schema=${selectedSchema}`} className='button'><EditNoteIcon />Edit a Fee Payment</Link></li>
        <li><Link to={`/class_add?schema=${selectedSchema}`} className='button1'><NoteAddIcon />Add a Class</Link></li>
        <li><Link to={`/class_search?schema=${selectedSchema}`} className='button'><PageviewIcon />Find Class Records</Link></li>
        <li><Link to={`/class_edit?schema=${selectedSchema}`} className='button'><BorderColorIcon />Edit Class name</Link></li>
        <li><Link to={`/print_fee?schema=${selectedSchema}`} className='button1'><PrintIcon />Print Fee slip</Link></li>
        <li><Link to={`/stud_delete?schema=${selectedSchema}`} className='button2'><PersonRemoveIcon />Delete Student Record</Link></li>
        <li><Link to={`/delete_fee?schema=${selectedSchema}`} className='button2'><DeleteIcon />Delete a Fee Record</Link></li>
        <li><Link to={`/new_database?schema=${selectedSchema}`} className='button'><AddIcon />New Session</Link></li>
        <li><Link to="/" className='button3'><LogoutIcon />Logout</Link></li>
      </>
    );
  };

  return (
    <div className='sidebar'>
      <div className='greet'>
        <p>Dashboard</p>
      </div>
      <div className='links'>
        {renderSchemaLinks()}
      </div>
    </div>
  );
}

export default SideBar;
