import MonitorPage from './execution/MonitorPage';
import useWorkflowToRestoreId from './store/useWorkflowToRestoreId';
import useStore from './store/useStore';
import MonitorPageFallback from './suspense/MonitorPageFallback';
import SuspenseBoundary from './suspense/SuspenseBoundary';
import { useEffect } from 'react';

function MonitorRoute() {
  const setWorkflowToRestoreId = useWorkflowToRestoreId((state) => state.setId);
  const graphInfo = useStore((state) => state.graphInfo);

  useEffect(() => {
    if (graphInfo.id) {
      setWorkflowToRestoreId(graphInfo.id);
    }
  }, [graphInfo.id, setWorkflowToRestoreId]);

  return (
    <SuspenseBoundary FallbackComponent={MonitorPageFallback}>
      <MonitorPage />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
