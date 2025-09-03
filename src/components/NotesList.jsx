import React, { useState, useEffect } from 'react';
import { notesAPI } from '../api';
import NoteEditor from './NoteEditor';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleSave = async (noteData) => {
    try {
      if (selectedNote) {
        await notesAPI.update(selectedNote.id, noteData);
      } else {
        await notesAPI.create(noteData);
      }
      loadNotes();
      setSelectedNote(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.delete(id);
        loadNotes();
        setSelectedNote(null);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const getShareLink = (shareId) => {
    return `${window.location.origin}/shared/${shareId}`;
  };

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // reset copied state when selected note changes
    setCopied(false);
  }, [selectedNote?.id]);

  const handleCopyShareLink = (shareId) => {
    const link = getShareLink(shareId);

    const fallbackCopy = (text) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (err) {
        console.error('Fallback: unable to copy', err);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
      }).catch(() => fallbackCopy(link));
    } else {
      fallbackCopy(link);
    }

    // clear the copied indicator after a short delay
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Notes List Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px', overflowY: 'auto' }}>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedNote(null);
          }}
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        >
          + New Note
        </button>
        
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedNote(note);
              setIsCreating(false);
            }}
            style={{
              padding: '10px',
              margin: '5px 0',
              cursor: 'pointer',
              backgroundColor: selectedNote?.id === note.id ? '#e0e0e0' : '#f5f5f5',
              borderRadius: '5px',
            }}
          >
            <h4 style={{ margin: '0 0 5px 0' }}>{note.title || 'Untitled'}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              {new Date(note.updated_at).toLocaleDateString()}
            </p>
            {note.is_public && (
              <span style={{ fontSize: '10px', color: 'green' }}>Public</span>
            )}
          </div>
        ))}
      </div>

      {/* Note Editor */}
      <div style={{ flex: 1, padding: '20px' }}>
        {(selectedNote || isCreating) ? (
          <div>
            <NoteEditor
              note={selectedNote}
              onSave={handleSave}
              onCancel={() => {
                setSelectedNote(null);
                setIsCreating(false);
              }}
            />
            
            {selectedNote && (
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={() => handleDelete(selectedNote.id)}
                  style={{ padding: '10px', backgroundColor: '#ff4444', color: 'white', border: 'none' }}
                >
                  Delete Note
                </button>
                
                {selectedNote.is_public && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleCopyShareLink(selectedNote.share_id)}
                      style={{ padding: '10px', backgroundColor: '#0366d6', color: 'white', border: 'none' }}
                    >
                      {copied ? 'Copied!' : 'Copy share link'}
                    </button>
                    <a
                      href={getShareLink(selectedNote.share_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '14px', color: '#0366d6' }}
                    >
                      Open link
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h3>Select a note or create a new one</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesList;