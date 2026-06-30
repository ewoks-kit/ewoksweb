import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router, Switch, Redirect } from 'wouter';
import { apiSuffix, baseUrl } from './api/client';
import EditRoute from './EditRoute';
import SimpleSnackbar from './general/Snackbar';
import MonitorRoute from './MonitorRoute';
import NavBar from './navbar/NavBar';
import SocketClientProvider from './SocketClientProvider';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketClientProvider baseUrl={baseUrl} apiSuffix={apiSuffix}>
        <Router base={import.meta.env.VITE_ROUTER_BASE_DIR}>
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
            <Route>
              <Redirect to="/edit" replace />
            </Route>
          </Switch>
        </Router>
      </SocketClientProvider>
    </QueryClientProvider>
  );
}
