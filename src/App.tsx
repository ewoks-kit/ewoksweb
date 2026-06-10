import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router, Switch, Redirect } from 'wouter';
import { apiSuffix, baseUrl } from './api/client';
import EditRoute from './EditRoute';
import SimpleSnackbar from './general/Snackbar';
import MonitorRoute from './MonitorRoute';
import NavBar from './navbar/NavBar';
import SocketClientProvider from './SocketClientProvider';
import { useLocationWithConfirmation } from './edition/hooks';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketClientProvider baseUrl={baseUrl} apiSuffix={apiSuffix}>
        <Router
          base={import.meta.env.VITE_ROUTER_BASE_DIR}
          hook={useLocationWithConfirmation}
        >
          <SimpleSnackbar />
          <CssBaseline />
          <NavBar />
          <Switch>
            <Route path="/edit">
              <EditRoute />
            </Route>
            <Route path="/monitor">
              <MonitorRoute />
            </Route>
            <Redirect to="/edit" replace />
          </Switch>
        </Router>
      </SocketClientProvider>
    </QueryClientProvider>
  );
}
