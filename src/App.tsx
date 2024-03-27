import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { apiSuffix, baseUrl } from './api/client';
import EditRoute from './EditRoute';
import SimpleSnackbar from './general/Snackbar';
import MonitorRoute from './MonitorRoute';
import NavBar from './navbar/NavBar';
import SocketClientProvider from './SocketClientProvider';

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: 'edit',
          element: <EditRoute />,
        },
        {
          path: 'monitor',
          element: <MonitorRoute />,
        },
        {
          path: '/',
          element: <Navigate to="edit" replace />,
        },
      ],
    },
  ],
  { basename: import.meta.env.VITE_ROUTER_BASE_DIR },
);

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketClientProvider baseUrl={baseUrl} apiSuffix={apiSuffix}>
        <RouterProvider router={router} />
      </SocketClientProvider>
    </QueryClientProvider>
  );
}
