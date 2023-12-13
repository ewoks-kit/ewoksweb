import { createPortal } from 'react-dom';

import QuickOpen from '../../general/QuickOpen';
import useNavBarElementStore from '../../navbar/useNavBarElementStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import OpenActionMenuButton from './menu/OpenActionMenuButton';
import SaveToServerButton from './SaveToServerButton';
import styles from './TopAppBar.module.css';
import TopWorkflowLabel from './TopWorkflowLabel';

function TopAppBar() {
  const navBarElement = useNavBarElementStore((state) => state.element);

  if (!navBarElement) {
    return null;
  }

  return createPortal(
    <>
      <h1 className={styles.crumbs} aria-label="Workflow title">
        <TopWorkflowLabel />
      </h1>
      <div className={styles.toolbar}>
        <SuspenseBoundary>
          <QuickOpen />
        </SuspenseBoundary>
        <SaveToServerButton />
        <OpenActionMenuButton />
      </div>
    </>,
    navBarElement,
  );
}

export default TopAppBar;
