import { CacheProvider } from '@rest-hooks/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EditRoute from './EditRoute';
import MonitorRoute from './MonitorRoute';

function App() {
  return (
    <CacheProvider>
      <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE_DIR}>
        <Routes>
          <Route path="/" element={<EditRoute />} />
          <Route path="/edit" element={<Navigate to="/" replace />} />
          <Route path="/monitor" element={<MonitorRoute />} />
        </Routes>
      </BrowserRouter>
    </CacheProvider>
  );
}

export default App;
