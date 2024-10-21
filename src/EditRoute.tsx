import 'react-reflex/styles.css';
import '@xyflow/react/dist/style.css';

import { ReactFlowProvider } from '@xyflow/react';

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
