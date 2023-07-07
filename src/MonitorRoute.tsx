import ExecutedWorkflows from './execution/ExecutedWorkflows';
import SuspenseBoundary from './Suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary>
      <ExecutedWorkflows />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
