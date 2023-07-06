import { CacheProvider } from '@rest-hooks/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EditRoute from './EditRoute';
import MonitorRoute from './MonitorRoute';

import NavBar from './navbar/Navbar';

function App() {
  return (
    <CacheProvider>
      <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE_DIR}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/edit" replace />} />
          <Route path="/edit" element={<EditRoute />} />
          <Route path="/monitor" element={<MonitorRoute />} />
        </Routes>
      </BrowserRouter>
    </CacheProvider>
  );
}

export default App;
