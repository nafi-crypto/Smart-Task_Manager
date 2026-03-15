import React, { useState, useRef, useEffect } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import { FiX } from 'react-icons/fi';

export default function AddCardForm({ columnId, onClose }) {
  const { createCard } = useBoardContext();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createCard(columnId, { title: title.trim() });
      setTitle('');
      textareaRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--accent-blue)',
      borderRadius: 8,
      padding: 10,
      boxShadow: '0 0 0 3px rgba(31,111,235,0.15)',
    }}>
      <textarea
        ref={textareaRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
          if (e.key === 'Escape') onClose();
        }}
        placeholder="Card title…"
        rows={2}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: 13,
          fontFamily: 'Inter, sans-serif',
          resize: 'none',
          lineHeight: 1.5,
          marginBottom: 8,
        }}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || loading}
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '5px 10px', opacity: (!title.trim() || loading) ? 0.6 : 1 }}
        >
          {loading ? 'Adding…' : 'Add card'}
        </button>
        <button
          onClick={onClose}
          className="btn btn-ghost"
          style={{ padding: '5px 8px' }}
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  );
}
