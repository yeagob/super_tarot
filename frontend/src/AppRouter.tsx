import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import { EditorPage } from './pages/EditorPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  );
};

export default AppRouter;
