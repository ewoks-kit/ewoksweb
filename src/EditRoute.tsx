import 'react-reflex/styles.css';
import 'reactflow/dist/style.css';

import { ReactFlowProvider } from 'reactflow';

import EditPage from './edition/EditPage';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function EditRoute() {
  return (
    <ReactFlowProvider>
      <SuspenseBoundary>
        <EditPage />
      </SuspenseBoundary>
    </ReactFlowProvider>
  );
}

export default EditRoute;
