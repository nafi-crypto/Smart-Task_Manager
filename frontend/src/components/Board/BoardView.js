import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useBoardContext } from '../../context/BoardContext';
import BoardHeader from '../Header/BoardHeader';
import KanbanColumn from '../Column/KanbanColumn';
import AddColumnForm from '../Column/AddColumnForm';
import CardDetailModal from '../Modals/CardDetailModal';
import LoadingSpinner from '../Common/LoadingSpinner';

export default function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBoard, columns, cards, loading, error, fetchBoard, fetchColumns, onDragEnd } = useBoardContext();
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    (async () => {
      const board = await fetchBoard(id);
      if (board) await fetchColumns(id);
    })();
  }, [id]); // eslint-disable-line

  const handleCardClick = useCallback((cardId) => {
    setSelectedCardId(cardId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCardId(null);
  }, []);

  if (loading && !currentBoard) return <LoadingSpinner fullscreen />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
      <div className="text-center">
        <p className="text-lg mb-4">Failed to load board</p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Back to boards</button>
      </div>
    </div>
  );
  if (!currentBoard) return null;

  const orderedColumns = (currentBoard.columnOrder || [])
    .map(cid => columns[cid])
    .filter(Boolean);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: currentBoard.backgroundColor
        ? `linear-gradient(135deg, ${currentBoard.backgroundColor}cc 0%, ${currentBoard.backgroundColor}44 100%), var(--bg-primary)`
        : 'var(--bg-primary)',
    }}>
      <BoardHeader board={currentBoard} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="board-scroll"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '16px 20px',
                overflowX: 'auto',
                overflowY: 'hidden',
              }}
            >
              {orderedColumns.map((col, index) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  cards={(col.cardOrder || []).map(cid => cards[cid]).filter(Boolean)}
                  index={index}
                  onCardClick={handleCardClick}
                />
              ))}
              {provided.placeholder}
              <AddColumnForm boardId={currentBoard.id} />
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedCardId && (
        <CardDetailModal
          cardId={selectedCardId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
