import WorkflowList from './execution/WorkflowList';
import MonitorPageFallback from './suspense/MonitorPageFallback';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary FallbackComponent={MonitorPageFallback}>
      <WorkflowList />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
