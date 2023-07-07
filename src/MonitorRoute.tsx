import ExecutedWorkflows from './edition/Execution/ExecutedWorkflows';
import SuspenseBoundary from './edition/Suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary>
      <ExecutedWorkflows />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
