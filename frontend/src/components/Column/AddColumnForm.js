import React, { useState, useRef, useEffect } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import { FiPlus, FiX } from 'react-icons/fi';

export default function AddColumnForm({ boardId }) {
  const { createColumn } = useBoardContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createColumn(boardId, { title: title.trim() });
      setTitle('');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: 264,
          flexShrink: 0,
          background: 'rgba(255,255,255,0.07)',
          border: '1px dashed rgba(255,255,255,0.15)',
          borderRadius: 12,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '14px',
          color: 'rgba(255,255,255,0.55)',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 0.15s',
          alignSelf: 'flex-start',
          minHeight: 52,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
        }}
      >
        <FiPlus size={16} />
        Add another list
      </button>
    );
  }

  return (
    <div style={{
      width: 280,
      flexShrink: 0,
      background: 'rgba(22,27,34,0.95)',
      border: '1px solid var(--border-color)',
      borderRadius: 12,
      padding: 12,
      alignSelf: 'flex-start',
      backdropFilter: 'blur(8px)',
    }}>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter list title…"
          className="input-base"
          style={{ marginBottom: 10 }}
          onKeyDown={e => e.key === 'Escape' && setOpen(false)}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center', opacity: (!title.trim() || loading) ? 0.6 : 1 }}
          >
            {loading ? 'Adding…' : 'Add list'}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setTitle(''); }}
            className="btn btn-ghost"
            style={{ padding: '6px 10px' }}
          >
            <FiX size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
