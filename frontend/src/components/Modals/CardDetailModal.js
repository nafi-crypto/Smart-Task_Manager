import React, { useState, useEffect, useRef } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import {
  PRIORITY_CONFIG, LABEL_COLORS, COVER_COLORS,
  formatDueDate, getChecklistProgress
} from '../../utils/helpers';
import DatePicker from 'react-datepicker';
import {
  FiX, FiTag, FiFlag, FiCalendar, FiCheckSquare,
  FiMessageSquare, FiTrash2, FiPlus, FiEdit2,
  FiUser, FiDroplet
} from 'react-icons/fi';
import { format } from 'date-fns';

export default function CardDetailModal({ cardId, onClose }) {
  const { cards, columns, updateCard, deleteCard, addComment, addChecklistItem, toggleChecklistItem } = useBoardContext();
  const card = cards[cardId];

  const [editingTitle, setEditingTitle]       = useState(false);
  const [titleVal, setTitleVal]               = useState('');
  const [editingDesc, setEditingDesc]         = useState(false);
  const [descVal, setDescVal]                 = useState('');
  const [commentText, setCommentText]         = useState('');
  const [newCheckItem, setNewCheckItem]       = useState('');
  const [addingCheck, setAddingCheck]         = useState(false);
  const [activePanel, setActivePanel]         = useState(null); // 'labels'|'priority'|'due'|'cover'|'assign'
  const [dueDate, setDueDate]                 = useState(null);
  const titleRef   = useRef(null);
  const descRef    = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (card) {
      setTitleVal(card.title || '');
      setDescVal(card.description || '');
      setDueDate(card.dueDate ? new Date(card.dueDate) : null);
    }
  }, [card]);

  useEffect(() => {
    if (editingTitle) titleRef.current?.focus();
  }, [editingTitle]);

  useEffect(() => {
    if (editingDesc) descRef.current?.focus();
  }, [editingDesc]);

  if (!card) return null;

  // Find column name
  const col = Object.values(columns).find(c => c.id === card.columnId);
  const dueInfo = card.dueDate ? formatDueDate(card.dueDate) : null;
  const clProgress = getChecklistProgress(card.checklist);

  // ── Handlers ──────────────────────────────────────────────
  const saveTitle = async () => {
    if (titleVal.trim() && titleVal !== card.title) {
      await updateCard(cardId, { title: titleVal.trim() });
    }
    setEditingTitle(false);
  };

  const saveDesc = async () => {
    if (descVal !== card.description) {
      await updateCard(cardId, { description: descVal });
    }
    setEditingDesc(false);
  };

  const handleLabelToggle = async (labelId) => {
    const current = card.labels || [];
    const updated = current.includes(labelId)
      ? current.filter(l => l !== labelId)
      : [...current, labelId];
    await updateCard(cardId, { labels: updated });
  };

  const handlePriority = async (p) => {
    await updateCard(cardId, { priority: p });
    setActivePanel(null);
  };

  const handleDueDate = async (date) => {
    setDueDate(date);
    await updateCard(cardId, { dueDate: date ? date.toISOString() : null });
    setActivePanel(null);
  };

  const handleCoverColor = async (color) => {
    await updateCard(cardId, { coverColor: color });
    setActivePanel(null);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(cardId, commentText.trim(), 'You');
    setCommentText('');
  };

  const handleAddChecklist = async (e) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    await addChecklistItem(cardId, newCheckItem.trim());
    setNewCheckItem('');
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this card?')) {
      await deleteCard(cardId, card.columnId);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const sidebarButtons = [
    { icon: FiTag,       label: 'Labels',   panel: 'labels'   },
    { icon: FiFlag,      label: 'Priority', panel: 'priority' },
    { icon: FiCalendar,  label: 'Due Date', panel: 'due'      },
    { icon: FiDroplet,   label: 'Cover',    panel: 'cover'    },
  ];

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div
        className="animate-scale-in"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cover color bar */}
        {card.coverColor && (
          <div style={{ height: 8, background: card.coverColor, borderRadius: '14px 14px 0 0' }} />
        )}

        {/* Header */}
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1 }}>
            {col && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color || '#30363d' }} />
                {col.title}
              </div>
            )}
            {editingTitle ? (
              <textarea
                ref={titleRef}
                value={titleVal}
                onChange={e => setTitleVal(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveTitle(); } if (e.key === 'Escape') { setTitleVal(card.title); setEditingTitle(false); } }}
                style={{
                  width: '100%', background: 'var(--bg-primary)',
                  border: '1px solid var(--accent-blue)', borderRadius: 6,
                  color: 'var(--text-primary)', fontSize: 18, fontWeight: 700,
                  fontFamily: 'Sora, sans-serif', padding: '6px 10px',
                  outline: 'none', resize: 'none', lineHeight: 1.35,
                  boxShadow: '0 0 0 3px rgba(31,111,235,0.2)',
                }}
                rows={2}
              />
            ) : (
              <h2
                onClick={() => setEditingTitle(true)}
                style={{
                  fontSize: 18, fontWeight: 700, fontFamily: 'Sora, sans-serif',
                  color: 'var(--text-primary)', lineHeight: 1.35, cursor: 'text',
                  letterSpacing: '-0.02em', padding: '4px 6px', borderRadius: 6,
                  border: '1px solid transparent', transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
              >
                {card.title}
              </h2>
            )}
          </div>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6, flexShrink: 0, marginTop: 2 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <FiX size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 0, padding: '16px 20px 20px' }}>
          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
            {/* Meta badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {card.priority && (
                <span className={`label-pill ${PRIORITY_CONFIG[card.priority]?.className}`} style={{ fontSize: 11 }}>
                  {PRIORITY_CONFIG[card.priority]?.label}
                </span>
              )}
              {dueInfo && (
                <span style={{
                  fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 999,
                  color: dueInfo.overdue ? 'var(--accent-red)' : dueInfo.urgent ? '#e3b341' : 'var(--text-secondary)',
                  background: dueInfo.overdue ? 'rgba(218,54,51,0.12)' : dueInfo.urgent ? 'rgba(210,153,34,0.12)' : 'var(--bg-hover)',
                  border: `1px solid ${dueInfo.overdue ? 'rgba(218,54,51,0.3)' : dueInfo.urgent ? 'rgba(210,153,34,0.3)' : 'var(--border-color)'}`,
                }}>
                  <FiCalendar size={10} />
                  {dueInfo.label}
                </span>
              )}
              {(card.labels || []).map(lid => {
                const lc = LABEL_COLORS.find(l => l.id === lid);
                return lc ? (
                  <span key={lid} className="label-pill" style={{ background: lc.color + '33', color: lc.text, border: `1px solid ${lc.color}55`, fontSize: 11 }}>
                    {lc.label}
                  </span>
                ) : null;
              })}
            </div>

            {/* Description */}
            <Section icon={<FiEdit2 size={13} />} title="Description">
              {editingDesc ? (
                <div>
                  <textarea
                    ref={descRef}
                    value={descVal}
                    onChange={e => setDescVal(e.target.value)}
                    placeholder="Add a more detailed description…"
                    className="input-base"
                    style={{ minHeight: 100, marginBottom: 8 }}
                    onKeyDown={e => { if (e.key === 'Escape') { setDescVal(card.description || ''); setEditingDesc(false); } }}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={saveDesc}>Save</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { setDescVal(card.description || ''); setEditingDesc(false); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingDesc(true)}
                  style={{
                    minHeight: 60, padding: '10px 12px', borderRadius: 8,
                    background: 'var(--bg-hover)', cursor: 'text',
                    fontSize: 13, color: card.description ? 'var(--text-primary)' : 'var(--text-muted)',
                    lineHeight: 1.6, border: '1px solid transparent', transition: 'border-color 0.15s',
                    whiteSpace: 'pre-wrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                  {card.description || 'Add a description…'}
                </div>
              )}
            </Section>

            {/* Checklist */}
            <Section icon={<FiCheckSquare size={13} />} title="Checklist">
              {clProgress && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                    <span>{clProgress.percent}%</span>
                    <span>{clProgress.done}/{clProgress.total} done</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border-color)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${clProgress.percent}%`,
                      background: clProgress.done === clProgress.total ? '#238636' : 'var(--accent-blue)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                {(card.checklist || []).map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', borderRadius: 6, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <input type="checkbox" checked={item.completed} onChange={() => toggleChecklistItem(cardId, item.id)}
                      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--accent-blue)' }} />
                    <span style={{ fontSize: 13, color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.completed ? 'line-through' : 'none', flex: 1 }}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
              {addingCheck ? (
                <form onSubmit={handleAddChecklist} style={{ display: 'flex', gap: 6 }}>
                  <input
                    autoFocus
                    value={newCheckItem}
                    onChange={e => setNewCheckItem(e.target.value)}
                    placeholder="Add an item…"
                    className="input-base"
                    style={{ flex: 1, fontSize: 12 }}
                    onKeyDown={e => e.key === 'Escape' && setAddingCheck(false)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ fontSize: 12 }}>Add</button>
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setAddingCheck(false)}>Cancel</button>
                </form>
              ) : (
                <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setAddingCheck(true)}>
                  <FiPlus size={12} /> Add item
                </button>
              )}
            </Section>

            {/* Comments */}
            <Section icon={<FiMessageSquare size={13} />} title="Comments">
              <form onSubmit={handleComment} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: 'white' }}>
                  Y
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Write a comment…"
                    className="input-base"
                    style={{ marginBottom: commentText ? 8 : 0, fontSize: 13 }}
                    onFocus={e => { /* show submit btn on focus */ }}
                  />
                  {commentText && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="submit" className="btn btn-primary" style={{ fontSize: 12 }}>Save</button>
                      <button type="button" className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setCommentText('')}>Cancel</button>
                    </div>
                  )}
                </div>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(card.comments || []).slice().reverse().map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${(c.authorName?.charCodeAt(0) || 0) * 37 % 360}, 60%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: 'white' }}>
                      {(c.authorName || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.authorName || 'User'}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : ''}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-hover)', padding: '8px 12px', borderRadius: 8 }}>
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <div style={{ width: 156, flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sidebarButtons.map(btn => (
                <div key={btn.panel} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setActivePanel(activePanel === btn.panel ? null : btn.panel)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: activePanel === btn.panel ? 'var(--bg-hover)' : 'var(--bg-card)',
                      color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
                      transition: 'all 0.1s', textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = activePanel === btn.panel ? 'var(--bg-hover)' : 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <btn.icon size={13} /> {btn.label}
                  </button>

                  {/* Panel dropdowns */}
                  {activePanel === btn.panel && (
                    <div style={{
                      position: 'absolute', right: '100%', top: 0, marginRight: 8,
                      background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                      borderRadius: 8, padding: 12, zIndex: 50, minWidth: 200,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      animation: 'scaleIn 0.12s ease',
                    }}>
                      {/* Labels panel */}
                      {btn.panel === 'labels' && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Labels</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {LABEL_COLORS.map(lc => (
                              <label key={lc.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 6px', borderRadius: 5 }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <input type="checkbox" checked={(card.labels || []).includes(lc.id)} onChange={() => handleLabelToggle(lc.id)}
                                  style={{ accentColor: lc.color, width: 13, height: 13 }} />
                                <span style={{ flex: 1, height: 16, borderRadius: 3, background: lc.color }} />
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lc.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Priority panel */}
                      {btn.panel === 'priority' && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</div>
                          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                            <button key={key} onClick={() => handlePriority(key)}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                padding: '6px 8px', borderRadius: 5, border: 'none', cursor: 'pointer',
                                background: card.priority === key ? 'var(--bg-hover)' : 'transparent',
                                fontSize: 13, textAlign: 'left', marginBottom: 2,
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                              onMouseLeave={e => e.currentTarget.style.background = card.priority === key ? 'var(--bg-hover)' : 'transparent'}
                            >
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                              <span style={{ color: 'var(--text-primary)', flex: 1 }}>{cfg.label}</span>
                              {card.priority === key && <span style={{ color: 'var(--accent-blue)', fontSize: 11 }}>✓</span>}
                            </button>
                          ))}
                          {card.priority && (
                            <button onClick={() => handlePriority(null)} style={{ width: '100%', padding: '5px 8px', marginTop: 4, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', textAlign: 'left' }}>
                              Clear priority
                            </button>
                          )}
                        </div>
                      )}

                      {/* Due date panel */}
                      {btn.panel === 'due' && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</div>
                          <DatePicker
                            selected={dueDate}
                            onChange={handleDueDate}
                            inline
                            minDate={new Date()}
                          />
                          {dueDate && (
                            <button onClick={() => handleDueDate(null)} style={{ width: '100%', padding: '5px 8px', marginTop: 6, borderRadius: 5, border: 'none', background: 'var(--bg-hover)', cursor: 'pointer', fontSize: 12, color: 'var(--accent-red)' }}>
                              Remove due date
                            </button>
                          )}
                        </div>
                      )}

                      {/* Cover color panel */}
                      {btn.panel === 'cover' && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover Color</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                            {COVER_COLORS.map(c => (
                              <button key={c} onClick={() => handleCoverColor(c)}
                                style={{
                                  width: '100%', paddingTop: '65%', borderRadius: 5, border: card.coverColor === c ? '2px solid white' : '2px solid transparent',
                                  background: c, cursor: 'pointer', position: 'relative',
                                  transition: 'transform 0.1s, border-color 0.1s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              />
                            ))}
                          </div>
                          {card.coverColor && (
                            <button onClick={() => handleCoverColor(null)} style={{ width: '100%', padding: '5px 8px', marginTop: 8, borderRadius: 5, border: 'none', background: 'var(--bg-hover)', cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
                              Remove cover
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
              <button onClick={handleDelete}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: 'var(--accent-red)', fontSize: 12, fontWeight: 500, textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(218,54,51,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FiTrash2 size={13} /> Delete card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper sub-component
function Section({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{icon}</span>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}
