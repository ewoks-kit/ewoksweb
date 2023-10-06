import { useEffect } from 'react';

import MonitorPage from './execution/MonitorPage';
import useStore from './store/useStore';
import useWorkflowToRestoreId from './store/useWorkflowToRestoreId';
import MonitorPageFallback from './suspense/MonitorPageFallback';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function MonitorRoute() {
  const setWorkflowToRestoreId = useWorkflowToRestoreId((state) => state.setId);
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo
  );

  useEffect(() => {
    if (displayedWorkflowInfo.id) {
      setWorkflowToRestoreId(displayedWorkflowInfo.id);
    }
  }, [displayedWorkflowInfo.id, setWorkflowToRestoreId]);

  return (
    <SuspenseBoundary FallbackComponent={MonitorPageFallback}>
      <MonitorPage />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
