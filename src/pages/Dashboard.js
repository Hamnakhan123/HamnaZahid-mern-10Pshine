import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // adjust path based on your structure

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get('/notes');
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async () => {
    if (!newTitle.trim() || !newText.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      await axios.post('/notes', {
        title: newTitle,
        content: newText,
        category: newCategory,
      });
      setNewTitle('');
      setNewText('');
      setNewCategory('');
      fetchNotes();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`/notes/${id}`);
        fetchNotes();
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditedTitle(note.title);
    setEditedText(note.content);
    setEditedCategory(note.category || '');
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/notes/${id}`, {
        title: editedTitle,
        content: editedText,
        category: editedCategory,
      });
      setEditingNoteId(null);
      fetchNotes();
    } catch (err) {
      console.error('Error saving edit:', err);
    }
  };

  const togglePin = async (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    try {
      await axios.put(`/notes/${id}`, {
        ...note,
        pinned: !note.pinned,
      });
      fetchNotes();
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ✅ UI Styles (no changes)
  const containerStyle = {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  };

  const logoutBtnStyle = {
    padding: '10px 20px',
    backgroundColor: '#973f7dff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const addBtnStyle = {
    padding: '8px 15px',
    backgroundColor: '#973f7dff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '30px',
  };

  const notesGridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  };

  const noteCardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    position: 'relative',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    animation: 'fadeIn 0.5s ease-in',
  };

  const noteTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '10px',
  };

  const noteTextStyle = {
    color: '#666',
  };

  const pinIconStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#973f7dff',
  };

  const actionButtonsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '15px',
  };

  const editBtnStyle = {
    padding: '5px 10px',
    backgroundColor: '#08213bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const deleteBtnStyle = {
    padding: '5px 10px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const saveBtnStyle = {
    padding: '5px 10px',
    backgroundColor: '#5cb85c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const cancelBtnStyle = {
    padding: '5px 10px',
    backgroundColor: '#999',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const filteredNotes = sortedNotes.filter((note) =>
    `${note.title} ${note.content} ${note.category}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Your Notes</h1>
        <button style={logoutBtnStyle} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <input
          style={inputStyle}
          placeholder="Note Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          style={inputStyle}
          placeholder="Note Text"
          rows={3}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Category (e.g., Work, Personal)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button style={addBtnStyle} onClick={addNote}>
          Add Note
        </button>
        <input
          style={{ ...inputStyle, marginTop: '10px' }}
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={notesGridStyle}>
        {filteredNotes.map((note) => (
          <div key={note.id} style={noteCardStyle}>
            <div
              style={pinIconStyle}
              title={note.pinned ? 'Unpin Note' : 'Pin Note'}
              onClick={() => togglePin(note.id)}
            >
              📌
            </div>

            {editingNoteId === note.id ? (
              <>
                <input
                  style={inputStyle}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                  style={inputStyle}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <input
                  style={inputStyle}
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  placeholder="Category"
                />
                <div style={actionButtonsStyle}>
                  <button style={saveBtnStyle} onClick={() => saveEdit(note.id)}>
                    Save
                  </button>
                  <button style={cancelBtnStyle} onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={noteTitleStyle}>{note.title}</h2>
                <p style={noteTextStyle}>{note.content}</p>
                <p style={{ fontSize: '14px', color: '#888', marginTop: '5px' }}>
                  Category: {note.category || 'None'}
                </p>
                <div style={actionButtonsStyle}>
                  <button style={editBtnStyle} onClick={() => startEditing(note)}>
                    Edit
                  </button>
                  <button style={deleteBtnStyle} onClick={() => deleteNote(note.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
