import { Link, useLocation } from 'react-router-dom';

import useStore from '../store/useStore';
import useWorkflowToRestoreId from '../store/useWorkflowToRestoreId';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const { pathname } = useLocation();

  const setElement = useNavBarElementStore((state) => state.setElement);
  const resetWorkflowToRestoreId = useWorkflowToRestoreId(
    (state) => state.resetId,
  );
  const workflowToRestoreId = useWorkflowToRestoreId((state) => state.id);
  const setWorkflowToRestoreId = useWorkflowToRestoreId((state) => state.setId);
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  function handleClickEdit() {
    resetWorkflowToRestoreId();
  }

  function handleClickMonitor() {
    if (displayedWorkflowInfo.id) {
      setWorkflowToRestoreId(displayedWorkflowInfo.id);
    }
  }

  return (
    <div
      className={styles.navbar}
      ref={(elem) => setElement(elem ?? undefined)}
    >
      <nav className={styles.navlinks}>
        <div className={styles.title}>
          <Link to="/">EwoksWeb</Link>
        </div>
        {pathname.startsWith('/edit') ? (
          <span
            className={styles.link}
            data-selected={pathname.startsWith('/edit') || undefined}
          >
            Edit
          </span>
        ) : (
          <Link
            className={styles.link}
            data-selected={pathname.startsWith('/edit') || undefined}
            to={
              workflowToRestoreId
                ? `/edit?workflow=${workflowToRestoreId}`
                : '/edit'
            }
            onClick={handleClickEdit}
          >
            Edit
          </Link>
        )}
        <Link
          className={styles.link}
          data-selected={pathname.startsWith('/monitor') || undefined}
          to="/monitor"
          onClick={handleClickMonitor}
        >
          Monitor
        </Link>
      </nav>
    </div>
  );
}

export default NavBar;
