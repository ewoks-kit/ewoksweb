import { createPortal } from 'react-dom';

import GetWorkflowFromServerDropdown from '../../general/GetWorkflowFromServerDropdown';
import OpenActionMenuButton from './menu/OpenActionMenuButton';
import SaveToServerButton from './SaveToServerButton';
import Breadcrumbs from './Breadcrumbs';
import useNavBarElementStore from '../../navbar/useNavBarElementStore';

import styles from './TopAppBar.module.css';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';

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
    navBarElement
  );
}

export default TopAppBar;
