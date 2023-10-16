import { createPortal } from 'react-dom';

import GetWorkflowFromServerDropdown from '../../general/GetWorkflowFromServerDropdown';
import useNavBarElementStore from '../../navbar/useNavBarElementStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import Breadcrumbs from './Breadcrumbs';
import OpenActionMenuButton from './menu/OpenActionMenuButton';
import SaveToServerButton from './SaveToServerButton';
import styles from './TopAppBar.module.css';

function TopAppBar() {
  const navBarElement = useNavBarElementStore((state) => state.element);

  if (!navBarElement) {
    return null;
  }

  return createPortal(
    <>
      <h1 className={styles.crumbs}>
        <Breadcrumbs />
      </h1>
      <div className={styles.toolbar}>
        <SuspenseBoundary>
          <GetWorkflowFromServerDropdown />
        </SuspenseBoundary>
        <SaveToServerButton />
        <OpenActionMenuButton />
      </div>
    </>,
    navBarElement,
  );
}

export default TopAppBar;
