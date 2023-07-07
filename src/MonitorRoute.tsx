import ExecutedWorkflows from './Execution/ExecutedWorkflows';
import SuspenseBoundary from './Suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary>
      <ExecutedWorkflows />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
