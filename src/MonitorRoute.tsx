import ExecutedWorkflows from './execution/ExecutedWorkflows';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary>
      <ExecutedWorkflows />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
