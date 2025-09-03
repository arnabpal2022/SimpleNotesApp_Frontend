import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { notesAPI } from '../api';

function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNote();
  }, [shareId]);

  const loadNote = async () => {
    try {
      const response = await notesAPI.getShared(shareId);
      setNote(response.data);
    } catch (error) {
      setError('Note not found or not public');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>{note.title || 'Untitled Note'}</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Created on {new Date(note.created_at).toLocaleDateString()}
      </p>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        {note.content}
      </div>
    </div>
  );
}

export default SharedNote;
