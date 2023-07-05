import EditPage from './Components/edition/EditPage';
import 'react-reflex/styles.css';
import 'reactflow/dist/style.css';
import { ReactFlowProvider } from 'reactflow';

function EditRoute() {
  return (
    <ReactFlowProvider>
      <EditPage />
    </ReactFlowProvider>
  );
}

export default EditRoute;
