import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useBoardContext } from '../../context/BoardContext';
import TaskCard from '../Card/TaskCard';
import AddCardForm from '../Card/AddCardForm';
import { FiMoreHorizontal, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

export default function KanbanColumn({ column, cards, index, onCardClick }) {
  const { updateColumn, deleteColumn } = useBoardContext();
  const [addingCard, setAddingCard] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleTitleSave = async () => {
    if (title.trim() && title !== column.title) {
      await updateColumn(column.id, { title: title.trim() });
    }
    setEditingTitle(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${column.title}" and all its cards?`)) {
      await deleteColumn(column.id);
    }
    setMenuOpen(false);
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={snapshot.isDragging ? 'column-dragging' : ''}
          style={{
            width: 280,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: 12,
            background: 'rgba(22,27,34,0.95)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(8px)',
            ...provided.draggableProps.style,
          }}
        >
          {/* Column Header */}
          <div
            {...provided.dragHandleProps}
            style={{
              padding: '12px 14px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'grab',
              borderBottom: '1px solid var(--border-subtle)',
              borderRadius: '12px 12px 0 0',
            }}
          >
            {/* Color dot */}
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: column.color || '#30363d',
            }} />

            {/* Title */}
            {editingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setTitle(column.title); setEditingTitle(false); } }}
                onClick={e => e.stopPropagation()}
                style={{
                  flex: 1,
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--accent-blue)',
                  borderRadius: 5,
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '2px 7px',
                  outline: 'none',
                  fontFamily: 'Sora, sans-serif',
                }}
              />
            ) : (
              <span
                onDoubleClick={() => setEditingTitle(true)}
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: '-0.01em',
                  cursor: 'grab',
                  userSelect: 'none',
                }}
              >
                {column.title}
              </span>
            )}

            {/* Card count */}
            <span className="card-count">{cards.length}</span>

            {/* Menu */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 4, borderRadius: 4,
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.1s, background 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
              >
                <FiMoreHorizontal size={15} />
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute', right: 0, top: '110%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    minWidth: 160,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    zIndex: 40,
                    overflow: 'hidden',
                    animation: 'scaleIn 0.12s ease',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setEditingTitle(true); setMenuOpen(false); }}
                    style={menuItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FiEdit2 size={13} /> Rename
                  </button>
                  <button
                    onClick={() => { setAddingCard(true); setMenuOpen(false); }}
                    style={menuItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FiPlus size={13} /> Add card
                  </button>
                  <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
                  <button
                    onClick={handleDelete}
                    style={{ ...menuItemStyle, color: 'var(--accent-red)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(218,54,51,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FiTrash2 size={13} /> Delete column
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards droppable */}
          <Droppable droppableId={column.id} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="column-container"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '8px',
                  minHeight: 60,
                  background: snapshot.isDraggingOver
                    ? 'rgba(31,111,235,0.06)'
                    : 'transparent',
                  borderRadius: snapshot.isDraggingOver ? '0 0 10px 10px' : undefined,
                  transition: 'background 0.15s ease',
                }}
              >
                {cards.map((card, idx) => (
                  <TaskCard
                    key={card.id}
                    card={card}
                    index={idx}
                    onClick={() => onCardClick(card.id)}
                  />
                ))}
                {provided.placeholder}
                {cards.length === 0 && !snapshot.isDraggingOver && (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px 12px',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                  }}>
                    Drop cards here
                  </div>
                )}
              </div>
            )}
          </Droppable>

          {/* Add Card */}
          <div style={{ padding: '0 8px 8px' }}>
            {addingCard ? (
              <AddCardForm
                columnId={column.id}
                onClose={() => setAddingCard(false)}
              />
            ) : (
              <button
                onClick={() => setAddingCard(true)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  borderRadius: 8,
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <FiPlus size={14} />
                <span>Add a card</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  padding: '8px 14px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-primary)',
  fontSize: 13,
  textAlign: 'left',
  transition: 'background 0.1s',
};
