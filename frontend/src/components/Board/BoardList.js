import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardContext } from '../../context/BoardContext';
import { BOARD_BACKGROUNDS } from '../../utils/helpers';
import CreateBoardModal from '../Modals/CreateBoardModal';
import { FiPlus, FiGrid, FiClock, FiStar, FiTrash2, FiLayout } from 'react-icons/fi';
import { format } from 'date-fns';

export default function BoardList() {
  const { boards, fetchBoards, deleteBoard, loading } = useBoardContext();
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchBoards(); }, [fetchBoards]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this board and all its cards?')) {
      await deleteBoard(id);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Nav */}
      <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}
        className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-blue)' }}>
            <FiLayout size={16} color="white" />
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
            TaskFlow
          </span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <FiPlus size={15} /> New Board
        </button>
      </nav>

      {/* Hero */}
      <div className="px-8 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em' }}>
            Your Workspaces
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Manage your projects across boards
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4">
            <FiGrid size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              All Boards
            </span>
            <span className="card-count">{boards.length}</span>
          </div>

          {loading && boards.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading boards…</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Create board card */}
              <button
                onClick={() => setShowCreate(true)}
                className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 h-36 transition-all duration-150"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent-blue)';
                  e.currentTarget.style.color = 'var(--accent-blue)';
                  e.currentTarget.style.background = 'rgba(31,111,235,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <FiPlus size={22} />
                <span className="text-sm font-medium">Create new board</span>
              </button>

              {boards.map((board, i) => (
                <div
                  key={board.id}
                  onClick={() => navigate(`/board/${board.id}`)}
                  className="rounded-xl overflow-hidden cursor-pointer group animate-fade-in"
                  style={{
                    background: board.backgroundColor || BOARD_BACKGROUNDS[i % BOARD_BACKGROUNDS.length],
                    height: 144,
                    position: 'relative',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    animationDelay: `${i * 40}ms`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)',
                  }} />

                  {/* Content */}
                  <div style={{ position: 'absolute', inset: 0, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)', fontSize: 11 }}>
                        Active
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, board.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                        style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer' }}
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight" style={{ fontFamily: 'Sora, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                        {board.title}
                      </h3>
                      {board.description && (
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          {board.description.slice(0, 40)}{board.description.length > 40 ? '…' : ''}
                        </p>
                      )}
                      {board.createdAt && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          <FiClock size={10} />
                          {format(new Date(board.createdAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreate && <CreateBoardModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
