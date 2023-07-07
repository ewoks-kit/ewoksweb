import ExecutedWorkflows from './execution/ExecutedWorkflows';
import MonitorPageFallback from './suspense/MonitorPageFallback';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary FallbackComponent={MonitorPageFallback}>
      <ExecutedWorkflows />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
