import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Outlet, Routes } from 'react-router-dom';

import { apiSuffix, baseUrl } from './api/client';
import EditRoute from './EditRoute';
import SimpleSnackbar from './general/Snackbar';
import MonitorRoute from './MonitorRoute';
import NavBar from './navbar/NavBar';
import SocketClientProvider from './SocketClientProvider';
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient();

const router = createBrowserRouter([{ path: '*', Component: Root }]);

function Layout() {
  return (
    <>
      <SimpleSnackbar />
      <CssBaseline />
      <NavBar />
      <Outlet />
    </>
  );
}

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketClientProvider baseUrl={baseUrl} apiSuffix={apiSuffix}>
        {/* <BrowserRouter basename={import.meta.env.VITE_ROUTER_BASE_DIR}> */}
        <Routes>
          <Route element={<Layout />}>
            <Route path="/edit" element={<EditRoute />} />
            <Route path="/monitor" element={<MonitorRoute />} />
            <Route path="/*" element={<Navigate to="/edit" replace />} />
          </Route>
        </Routes>
        {/* </BrowserRouter> */}
      </SocketClientProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
