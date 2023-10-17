import 'react-reflex/styles.css';
import 'reactflow/dist/style.css';

import EditPage from './edition/EditPage';
import SuspenseBoundary from './suspense/SuspenseBoundary';

function EditRoute() {
  return (
    <SuspenseBoundary>
      <EditPage />
    </SuspenseBoundary>
  );
}

export default EditRoute;
