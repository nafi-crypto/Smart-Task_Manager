import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardContext } from '../../context/BoardContext';
import { BOARD_BACKGROUNDS } from '../../utils/helpers';
import { FiX } from 'react-icons/fi';

export default function CreateBoardModal({ onClose }) {
  const { createBoard } = useBoardContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bgColor, setBgColor] = useState(BOARD_BACKGROUNDS[0]);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const board = await createBoard({
        title: title.trim(),
        description: description.trim(),
        backgroundColor: bgColor,
      });
      navigate(`/board/${board.id}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="animate-slide-up"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Preview banner */}
        <div style={{
          height: 100,
          background: `linear-gradient(135deg, ${bgColor}ee 0%, ${bgColor}88 100%)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Sora, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)', letterSpacing: '-0.03em' }}>
            {title || 'Board Preview'}
          </span>
          <button onClick={onClose}
            style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 6, cursor: 'pointer', color: 'white', padding: 6, display: 'flex' }}>
            <FiX size={15} />
          </button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Sora, sans-serif', marginBottom: 16, color: 'var(--text-primary)' }}>
            Create new board
          </h2>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Board title *</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Product Roadmap"
              className="input-base"
              style={{ marginBottom: 12 }}
            />

            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this board about?"
              className="input-base"
              style={{ marginBottom: 16, minHeight: 70 }}
            />

            <label style={labelStyle}>Background color</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {BOARD_BACKGROUNDS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBgColor(c)}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: c, border: bgColor === c ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer', boxShadow: bgColor === c ? `0 0 0 2px ${c}` : 'none',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                disabled={!title.trim() || loading}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center', opacity: (!title.trim() || loading) ? 0.6 : 1 }}
              >
                {loading ? 'Creating…' : 'Create Board'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
