import Dashboard from './Components/Dashboard/Dashboard';
import 'react-reflex/styles.css';
import 'reactflow/dist/style.css';
import { ReactFlowProvider } from 'reactflow';

function EditRoute() {
  return (
    <ReactFlowProvider>
      <Dashboard />
    </ReactFlowProvider>
  );
}

export default EditRoute;
