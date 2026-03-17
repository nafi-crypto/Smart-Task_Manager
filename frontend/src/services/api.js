import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── Boards ──────────────────────────────────────────────
export const boardApi = {
  getAll: ()                   => api.get('/boards'),
  getById: (id)                => api.get(`/boards/${id}`),
  create: (data)               => api.post('/boards', data),
  update: (id, data)           => api.put(`/boards/${id}`, data),
  delete: (id)                 => api.delete(`/boards/${id}`),
  updateColumnOrder: (id, columnOrder) =>
    api.patch(`/boards/${id}/column-order`, { columnOrder }),
};

// ─── Columns ─────────────────────────────────────────────
export const columnApi = {
  getByBoard: (boardId)          => api.get(`/boards/${boardId}/columns`),
  create: (boardId, data)        => api.post(`/boards/${boardId}/columns`, data),
  update: (id, data)             => api.put(`/columns/${id}`, data),
  delete: (id)                   => api.delete(`/columns/${id}`),
  updateCardOrder: (id, cardOrder) =>
    api.patch(`/columns/${id}/card-order`, { cardOrder }),
  moveCard: (payload)            => api.post('/columns/move-card', payload),
};

// ─── Cards ───────────────────────────────────────────────
export const cardApi = {
  getByColumn: (columnId)      => api.get(`/columns/${columnId}/cards`),
  getById: (id)                => api.get(`/cards/${id}`),
  create: (columnId, data)     => api.post(`/columns/${columnId}/cards`, data),
  update: (id, data)           => api.put(`/cards/${id}`, data),
  delete: (id)                 => api.delete(`/cards/${id}`),
  addComment: (id, text, authorName) =>
    api.post(`/cards/${id}/comments`, { text, authorName }),
  addChecklistItem: (id, text) =>
    api.post(`/cards/${id}/checklist`, { text }),
  toggleChecklistItem: (cardId, itemId) =>
    api.patch(`/cards/${cardId}/checklist/${itemId}/toggle`),
  search: (boardId, q)         => api.get(`/boards/${boardId}/cards/search?q=${q}`),
};

export default api;
