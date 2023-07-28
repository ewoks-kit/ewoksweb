import MonitorPage from './execution/MonitorPage';
import MonitorPageFallback from './suspense/MonitorPageFallback';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function MonitorRoute() {
  return (
    <SuspenseBoundary FallbackComponent={MonitorPageFallback}>
      <MonitorPage />
    </SuspenseBoundary>
  );
}

export default MonitorRoute;
