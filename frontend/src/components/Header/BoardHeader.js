import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardContext } from '../../context/BoardContext';
import { FiArrowLeft, FiEdit2, FiSearch, FiX, FiLayout } from 'react-icons/fi';
import { cardApi } from '../../services/api';

export default function BoardHeader({ board }) {
  const navigate = useNavigate();
  const { updateBoard } = useBoardContext();
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleTitleSave = async () => {
    if (title.trim() && title !== board.title) {
      await updateBoard(board.id, { title: title.trim() });
    }
    setEditingTitle(false);
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    try {
      const res = await cardApi.search(board.id, q.trim());
      setSearchResults(res.data);
    } catch { setSearchResults([]); }
  };

  return (
    <header style={{
      background: 'rgba(13,17,23,0.85)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      position: 'relative',
      zIndex: 30,
    }}>
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="btn btn-ghost"
        style={{ padding: '6px 10px', gap: 4 }}
      >
        <FiArrowLeft size={15} />
        <span style={{ fontSize: 13 }}>Boards</span>
      </button>

      <div style={{ width: 1, height: 20, background: 'var(--border-color)' }} />

      {/* Board icon */}
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: board.backgroundColor || 'var(--accent-blue)' }}>
        <FiLayout size={13} color="white" />
      </div>

      {/* Editable title */}
      {editingTitle ? (
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleTitleSave}
          onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setTitle(board.title); setEditingTitle(false); } }}
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--accent-blue)',
            borderRadius: 6,
            color: 'var(--text-primary)',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'Sora, sans-serif',
            padding: '4px 10px',
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(31,111,235,0.2)',
            minWidth: 180,
          }}
        />
      ) : (
        <button
          onClick={() => setEditingTitle(true)}
          className="flex items-center gap-2 group"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>
            {board.title}
          </span>
          <FiEdit2 size={13} style={{ color: 'var(--text-muted)', opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: 'relative' }}>
        {searchOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search cards…"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 6,
                color: 'var(--text-primary)',
                fontSize: 13,
                padding: '6px 12px',
                outline: 'none',
                width: 220,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button className="btn-ghost p-1.5 rounded" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <FiX size={15} />
            </button>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 6,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                width: 280,
                maxHeight: 300,
                overflowY: 'auto',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                zIndex: 50,
              }}>
                {searchResults.map(card => (
                  <div key={card.id} style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 500 }}>{card.title}</div>
                    {card.description && (
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                        {card.description.slice(0, 60)}…
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="btn btn-ghost"
            style={{ padding: '6px 10px' }}
          >
            <FiSearch size={15} />
            <span style={{ fontSize: 13 }}>Search</span>
          </button>
        )}
      </div>
    </header>
  );
}
