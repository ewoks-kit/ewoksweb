import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { baseUrl } from './api/client';
import EditRoute from './EditRoute';
import SimpleSnackbar from './general/Snackbar';
import MonitorRoute from './MonitorRoute';
import NavBar from './navbar/NavBar';
import SocketClientProvider from './SocketClientProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketClientProvider serverUrl={baseUrl}>
        <BrowserRouter basename={import.meta.env.VITE_ROUTER_BASE_DIR}>
          <SimpleSnackbar />
          <CssBaseline />
          <NavBar />
          <Routes>
            <Route path="/edit" element={<EditRoute />} />
            <Route path="/monitor" element={<MonitorRoute />} />
            <Route path="/*" element={<Navigate to="/edit" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketClientProvider>
    </QueryClientProvider>
  );
}

export default App;
