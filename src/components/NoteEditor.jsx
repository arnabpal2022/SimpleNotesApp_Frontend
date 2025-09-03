import React, { useState, useEffect } from 'react';

function NoteEditor({ note, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_public: false,
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        is_public: note.is_public || false,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        is_public: false,
      });
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Note Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        style={{ width: '100%', padding: '10px', fontSize: '18px', marginBottom: '10px' }}
      />
      
      <textarea
        placeholder="Write your note here..."
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        style={{ width: '100%', height: '400px', padding: '10px', fontSize: '16px' }}
      />
      
      <div style={{ marginTop: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
          />
          Make this note public (shareable via link)
        </label>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>
          Save
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default NoteEditor;