import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppLayout from './components/AppLayout';
import ActorList from './pages/ActorList';
import Users from './pages/Users';

const Home: React.FC = () => {
  return (
    <div>
      <h2>Welcome to OneStory Admin</h2>
      <p>Select a section from the navigation above.</p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="dramas/actor-list" element={<ActorList />} />
            <Route path="users" element={<Users />} />
            <Route path="dramas/drama-list" element={<Navigate to="/dramas/actor-list" replace />} />
            <Route path="dramas/client-banner" element={<Navigate to="/dramas/actor-list" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;