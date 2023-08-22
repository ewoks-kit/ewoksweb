import { CssBaseline } from '@material-ui/core';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { baseUrl } from './api/client';
import EwoksCacheProvider from './EwoksCacheProvider';
import EditRoute from './EditRoute';
import MonitorRoute from './MonitorRoute';

import NavBar from './navbar/NavBar';
import SocketClientProvider from './SocketClientProvider';
import SimpleSnackbar from './general/Snackbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketClientProvider serverUrl={baseUrl}>
        <EwoksCacheProvider>
          <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE_DIR}>
            <SimpleSnackbar />
            <CssBaseline />
            <NavBar />
            <Routes>
              <Route path="/" element={<Navigate to="/edit" replace />} />
              <Route path="/edit" element={<EditRoute />} />
              <Route path="/monitor" element={<MonitorRoute />} />
            </Routes>
          </BrowserRouter>
        </EwoksCacheProvider>
      </SocketClientProvider>
    </QueryClientProvider>
  );
}

export default App;
