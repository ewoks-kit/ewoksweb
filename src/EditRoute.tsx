import 'react-reflex/styles.css';
import 'reactflow/dist/style.css';

import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';

import EditPage from './edition/EditPage';
import useWorkflowToRestoreId from './store/useWorkflowToRestoreId';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function EditRoute() {
  const resetWorkflowToRestoreId = useWorkflowToRestoreId(
    (state) => state.resetId,
  );

  useEffect(() => {
    resetWorkflowToRestoreId();
  }, [resetWorkflowToRestoreId]);

  return (
    <ReactFlowProvider>
      <SuspenseBoundary>
        <EditPage />
      </SuspenseBoundary>
    </ReactFlowProvider>
  );
}

export default EditRoute;
