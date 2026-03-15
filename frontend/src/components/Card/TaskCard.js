import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PRIORITY_CONFIG, LABEL_COLORS, formatDueDate, getChecklistProgress } from '../../utils/helpers';
import { FiMessageSquare, FiCheckSquare, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function TaskCard({ card, index, onClick }) {
  const priority   = card.priority ? PRIORITY_CONFIG[card.priority] : null;
  const dueInfo    = card.dueDate ? formatDueDate(card.dueDate) : null;
  const clProgress = getChecklistProgress(card.checklist);
  const hasFooter  = (card.comments?.length > 0) || clProgress || dueInfo || (card.assigneeIds?.length > 0);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`task-card ${snapshot.isDragging ? 'dnd-dragging' : ''}`}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            marginBottom: 6,
            cursor: 'pointer',
            userSelect: 'none',
            overflow: 'hidden',
            position: 'relative',
            ...provided.draggableProps.style,
          }}
        >
          {/* Cover color stripe */}
          {card.coverColor && (
            <div style={{ height: 6, background: card.coverColor, width: '100%' }} />
          )}

          <div style={{ padding: '10px 12px' }}>
            {/* Labels */}
            {card.labels?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 7 }}>
                {card.labels.map(labelId => {
                  const lc = LABEL_COLORS.find(l => l.id === labelId);
                  return lc ? (
                    <span
                      key={labelId}
                      className="label-pill"
                      style={{ background: lc.color + '33', color: lc.text, border: `1px solid ${lc.color}55` }}
                    >
                      {lc.label}
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Title */}
            <p style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: '1.45',
              marginBottom: hasFooter ? 8 : 0,
              wordBreak: 'break-word',
            }}>
              {card.title}
            </p>

            {/* Footer row */}
            {hasFooter && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {/* Priority badge */}
                {priority && (
                  <span className={`label-pill ${priority.className}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                    {priority.label}
                  </span>
                )}

                {/* Due date */}
                {dueInfo && (
                  <span
                    style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      fontSize: 11, fontWeight: 500,
                      color: dueInfo.overdue ? 'var(--accent-red)'
                           : dueInfo.urgent   ? '#e3b341'
                           : 'var(--text-secondary)',
                      background: dueInfo.overdue ? 'rgba(218,54,51,0.12)'
                                : dueInfo.urgent   ? 'rgba(210,153,34,0.12)'
                                : 'transparent',
                      padding: '1px 5px', borderRadius: 4,
                    }}
                  >
                    {dueInfo.overdue ? <FiAlertCircle size={10} /> : <FiClock size={10} />}
                    {dueInfo.label}
                  </span>
                )}

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Checklist progress */}
                {clProgress && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: clProgress.done === clProgress.total ? '#56d364' : 'var(--text-secondary)' }}>
                    <FiCheckSquare size={11} />
                    {clProgress.done}/{clProgress.total}
                  </span>
                )}

                {/* Comments */}
                {card.comments?.length > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-secondary)' }}>
                    <FiMessageSquare size={11} />
                    {card.comments.length}
                  </span>
                )}

                {/* Assignee avatars */}
                {card.assigneeIds?.length > 0 && (
                  <div style={{ display: 'flex' }}>
                    {card.assigneeIds.slice(0, 3).map((uid, i) => (
                      <div key={uid} style={{
                        width: 20, height: 20,
                        borderRadius: '50%',
                        background: `hsl(${(uid.charCodeAt(0) * 37) % 360}, 60%, 45%)`,
                        border: '1.5px solid var(--bg-card)',
                        marginLeft: i > 0 ? -6 : 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: 'white',
                      }}>
                        {uid.slice(0, 1).toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Checklist progress bar */}
            {clProgress && (
              <div style={{
                marginTop: 8, height: 3,
                background: 'var(--border-color)',
                borderRadius: 2, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${clProgress.percent}%`,
                  background: clProgress.done === clProgress.total ? '#238636' : 'var(--accent-blue)',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
