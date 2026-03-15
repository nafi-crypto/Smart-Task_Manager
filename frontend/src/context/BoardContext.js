import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { boardApi, columnApi, cardApi } from '../services/api';

// ─── State shape ─────────────────────────────────────────
const initialState = {
  boards: [],
  currentBoard: null,
  columns: {},      // { [columnId]: Column }
  cards: {},        // { [cardId]: Card }
  columnOrder: [],  // ordered list of columnIds
  loading: false,
  error: null,
};

// ─── Reducer ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_BOARDS':
      return { ...state, boards: action.payload, loading: false };
    case 'SET_BOARD':
      return { ...state, currentBoard: action.payload };
    case 'SET_COLUMNS': {
      const cols = {};
      action.payload.forEach(c => { cols[c.id] = c; });
      return { ...state, columns: cols };
    }
    case 'ADD_COLUMN': {
      const col = action.payload;
      return {
        ...state,
        columns: { ...state.columns, [col.id]: col },
        currentBoard: state.currentBoard
          ? { ...state.currentBoard, columnOrder: [...(state.currentBoard.columnOrder || []), col.id] }
          : state.currentBoard,
      };
    }
    case 'UPDATE_COLUMN':
      return { ...state, columns: { ...state.columns, [action.payload.id]: action.payload } };
    case 'REMOVE_COLUMN': {
      const { [action.payload]: _, ...rest } = state.columns;
      return {
        ...state,
        columns: rest,
        currentBoard: state.currentBoard
          ? { ...state.currentBoard, columnOrder: (state.currentBoard.columnOrder || []).filter(id => id !== action.payload) }
          : state.currentBoard,
      };
    }
    case 'SET_CARDS': {
      // action.payload: array of cards for a given column
      const newCards = { ...state.cards };
      action.payload.forEach(c => { newCards[c.id] = c; });
      return { ...state, cards: newCards };
    }
    case 'ADD_CARD': {
      const card = action.payload;
      const col = state.columns[card.columnId];
      return {
        ...state,
        cards: { ...state.cards, [card.id]: card },
        columns: col ? {
          ...state.columns,
          [col.id]: { ...col, cardOrder: [...(col.cardOrder || []), card.id] }
        } : state.columns,
      };
    }
    case 'UPDATE_CARD':
      return { ...state, cards: { ...state.cards, [action.payload.id]: action.payload } };
    case 'REMOVE_CARD': {
      const { [action.payload.cardId]: __, ...remainCards } = state.cards;
      const affectedCol = state.columns[action.payload.columnId];
      return {
        ...state,
        cards: remainCards,
        columns: affectedCol ? {
          ...state.columns,
          [affectedCol.id]: {
            ...affectedCol,
            cardOrder: (affectedCol.cardOrder || []).filter(id => id !== action.payload.cardId)
          }
        } : state.columns,
      };
    }
    case 'REORDER_COLUMNS':
      return {
        ...state,
        currentBoard: { ...state.currentBoard, columnOrder: action.payload },
      };
    case 'REORDER_CARDS_SAME_COL': {
      const { columnId, cardOrder } = action.payload;
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: { ...state.columns[columnId], cardOrder },
        },
      };
    }
    case 'MOVE_CARD_DIFF_COL': {
      const { sourceColId, destColId, sourceCardOrder, destCardOrder, cardId } = action.payload;
      const movedCard = state.cards[cardId];
      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColId]: { ...state.columns[sourceColId], cardOrder: sourceCardOrder },
          [destColId]:   { ...state.columns[destColId],   cardOrder: destCardOrder },
        },
        cards: {
          ...state.cards,
          [cardId]: movedCard ? { ...movedCard, columnId: destColId } : movedCard,
        },
      };
    }
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────
const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Boards ──
  const fetchBoards = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await boardApi.getAll();
      dispatch({ type: 'SET_BOARDS', payload: res.data });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  }, []);

  const fetchBoard = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await boardApi.getById(id);
      dispatch({ type: 'SET_BOARD', payload: res.data });
      dispatch({ type: 'SET_LOADING', payload: false });
      return res.data;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  }, []);

  const createBoard = useCallback(async (data) => {
    const res = await boardApi.create(data);
    await fetchBoards();
    return res.data;
  }, [fetchBoards]);

  const updateBoard = useCallback(async (id, data) => {
    const res = await boardApi.update(id, data);
    dispatch({ type: 'SET_BOARD', payload: res.data });
    return res.data;
  }, []);

  const deleteBoard = useCallback(async (id) => {
    await boardApi.delete(id);
    await fetchBoards();
  }, [fetchBoards]);

  // ── Columns ──
  const fetchColumns = useCallback(async (boardId) => {
    const res = await columnApi.getByBoard(boardId);
    dispatch({ type: 'SET_COLUMNS', payload: res.data });

    // Fetch cards for each column
    await Promise.all(res.data.map(col => fetchCards(col.id)));
  }, []); // eslint-disable-line

  const createColumn = useCallback(async (boardId, data) => {
    const res = await columnApi.create(boardId, data);
    dispatch({ type: 'ADD_COLUMN', payload: res.data });
    return res.data;
  }, []);

  const updateColumn = useCallback(async (id, data) => {
    const res = await columnApi.update(id, data);
    dispatch({ type: 'UPDATE_COLUMN', payload: res.data });
    return res.data;
  }, []);

  const deleteColumn = useCallback(async (id) => {
    await columnApi.delete(id);
    dispatch({ type: 'REMOVE_COLUMN', payload: id });
  }, []);

  // ── Cards ──
  const fetchCards = useCallback(async (columnId) => {
    const res = await cardApi.getByColumn(columnId);
    dispatch({ type: 'SET_CARDS', payload: res.data });
  }, []);

  const createCard = useCallback(async (columnId, data) => {
    const res = await cardApi.create(columnId, data);
    dispatch({ type: 'ADD_CARD', payload: res.data });
    return res.data;
  }, []);

  const updateCard = useCallback(async (id, data) => {
    const res = await cardApi.update(id, data);
    dispatch({ type: 'UPDATE_CARD', payload: res.data });
    return res.data;
  }, []);

  const deleteCard = useCallback(async (id, columnId) => {
    await cardApi.delete(id);
    dispatch({ type: 'REMOVE_CARD', payload: { cardId: id, columnId } });
  }, []);

  const addComment = useCallback(async (cardId, text, authorName) => {
    const res = await cardApi.addComment(cardId, text, authorName);
    dispatch({ type: 'UPDATE_CARD', payload: res.data });
    return res.data;
  }, []);

  const addChecklistItem = useCallback(async (cardId, text) => {
    const res = await cardApi.addChecklistItem(cardId, text);
    dispatch({ type: 'UPDATE_CARD', payload: res.data });
    return res.data;
  }, []);

  const toggleChecklistItem = useCallback(async (cardId, itemId) => {
    const res = await cardApi.toggleChecklistItem(cardId, itemId);
    dispatch({ type: 'UPDATE_CARD', payload: res.data });
    return res.data;
  }, []);

  // ── Drag & Drop ──
  const onDragEnd = useCallback(async (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'COLUMN') {
      const colOrder = Array.from(state.currentBoard.columnOrder || []);
      const [removed] = colOrder.splice(source.index, 1);
      colOrder.splice(destination.index, 0, removed);
      dispatch({ type: 'REORDER_COLUMNS', payload: colOrder });
      try {
        await boardApi.updateColumnOrder(state.currentBoard.id, colOrder);
      } catch (e) {
        console.error('Failed to persist column order', e);
      }
      return;
    }

    // CARD drag
    const srcColId  = source.droppableId;
    const destColId = destination.droppableId;
    const srcCol    = state.columns[srcColId];
    const destCol   = state.columns[destColId];
    if (!srcCol || !destCol) return;

    if (srcColId === destColId) {
      // Same column reorder
      const newOrder = Array.from(srcCol.cardOrder || []);
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      dispatch({ type: 'REORDER_CARDS_SAME_COL', payload: { columnId: srcColId, cardOrder: newOrder } });
      try {
        await columnApi.updateCardOrder(srcColId, newOrder);
      } catch (e) {
        console.error('Failed to persist card order', e);
      }
    } else {
      // Cross-column move
      const srcOrder  = Array.from(srcCol.cardOrder  || []);
      const destOrder = Array.from(destCol.cardOrder || []);
      const [moved] = srcOrder.splice(source.index, 1);
      destOrder.splice(destination.index, 0, moved);
      dispatch({
        type: 'MOVE_CARD_DIFF_COL',
        payload: { sourceColId: srcColId, destColId, sourceCardOrder: srcOrder, destCardOrder: destOrder, cardId: moved },
      });
      try {
        await columnApi.moveCard({
          sourceColumnId: srcColId,
          destColumnId:   destColId,
          sourceCardOrder: srcOrder,
          destCardOrder:   destOrder,
        });
      } catch (e) {
        console.error('Failed to persist card move', e);
      }
    }
  }, [state.currentBoard, state.columns]);

  const value = {
    ...state,
    fetchBoards, fetchBoard, createBoard, updateBoard, deleteBoard,
    fetchColumns, createColumn, updateColumn, deleteColumn,
    fetchCards, createCard, updateCard, deleteCard,
    addComment, addChecklistItem, toggleChecklistItem,
    onDragEnd,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export const useBoardContext = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoardContext must be used inside BoardProvider');
  return ctx;
};
