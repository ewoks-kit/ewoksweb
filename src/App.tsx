import Dashboard from './Components/Dashboard/Dashboard';
import 'react-reflex/styles.css';
import 'reactflow/dist/style.css';
import { CacheProvider } from '@rest-hooks/react';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <CacheProvider>
      <ReactFlowProvider>
        <Dashboard />
      </ReactFlowProvider>
    </CacheProvider>
  );
}

export default App;
