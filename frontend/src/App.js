import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BoardProvider } from './context/BoardContext';
import BoardList from './components/Board/BoardList';
import BoardView from './components/Board/BoardView';

export default function App() {
  return (
    <BrowserRouter>
      <BoardProvider>
        <Routes>
          <Route path="/"           element={<BoardList />} />
          <Route path="/board/:id"  element={<BoardView />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </BoardProvider>
    </BrowserRouter>
  );
}
