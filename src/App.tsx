import Dashboard from './Components/Dashboard/Dashboard';
import 'react-reflex/styles.css';
import 'reactflow/dist/style.css';
import { CacheProvider } from '@rest-hooks/react';

function App() {
  return (
    <div>
      <CacheProvider>
        <Dashboard />
      </CacheProvider>
    </div>
  );
}

export default App;
