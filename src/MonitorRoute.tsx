import ExecutedWorkflows from './Components/Execution/ExecutedWorkflows';
import SuspenseBoundary from './Components/Suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary>
      <ExecutedWorkflows />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
