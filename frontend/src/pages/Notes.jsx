import React, { useState } from 'react';
import '../styling/notes.css';

import CreateNotes from '../components/CreateNotes.jsx'  // import the component to be rendered in the notes tab
import Yesterday from '../components/Yesterday.jsx'
import  Revision from  '../components/Revision.jsx'
import  Improvements from '../components/Improvements.jsx'

const Notes = () => {
  const [tabstate1, settabstate1] = useState("CreateNotes");

  return (
    <div className="notes-container">
      <div className="notes-sidebar">
      <div className="notes-tab-container">
        <div className={`notes-tab ${tabstate1 === "CreateNotes" && "active"}`} onClick={() => settabstate1("CreateNotes")}>Notes</div>
        <div className={`notes-tab ${tabstate1 === "Yesterday" && "active"}`} onClick={() => settabstate1("Yesterday")}>Yesterday</div>
        <div className={`notes-tab ${tabstate1 === "Revision" && "active"}`} onClick={() => settabstate1("Revision")}>Revision</div>
        <div className={`notes-tab ${tabstate1 === "Improvements" && "active"}`} onClick={() => settabstate1("Improvements")}>Improvements</div>
     </div>
      </div>

      <div className="outer-yesterday-container">
        {
        (tabstate1=="CreateNotes")?<CreateNotes/>:""
      }
      {
        (tabstate1=="Yesterday")?<Yesterday/>:""
      }
      {
        (tabstate1=="Revision")?<Revision />:""
      }
      {
        (tabstate1=="Improvements")?<Improvements />:""
      }

      </div>
    </div>
  );
};

export default Notes;
