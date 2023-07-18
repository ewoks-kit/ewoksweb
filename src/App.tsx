import { CssBaseline } from '@material-ui/core';
import { CacheProvider } from '@rest-hooks/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { baseUrl } from './api/api';
import EditRoute from './EditRoute';
import MonitorRoute from './MonitorRoute';

import NavBar from './navbar/NavBar';
import SocketClientProvider from './SocketClientProvider';

function App() {
  return (
    <CacheProvider>
      <SocketClientProvider serverUrl={baseUrl}>
        <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE_DIR}>
          <CssBaseline />
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="/edit" replace />} />
            <Route path="/edit" element={<EditRoute />} />
            <Route path="/monitor" element={<MonitorRoute />} />
          </Routes>
        </BrowserRouter>
      </SocketClientProvider>
    </CacheProvider>
  );
}

export default App;
