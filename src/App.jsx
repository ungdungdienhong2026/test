import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MySchedule from './pages/MySchedule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<MySchedule />} />
          <Route path="rooms" element={<div className="p-8"><h1 className="text-2xl text-on-surface">Phòng họp (Sắp ra mắt)</h1></div>} />
          <Route path="settings" element={<div className="p-8"><h1 className="text-2xl text-on-surface">Cài đặt (Sắp ra mắt)</h1></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
