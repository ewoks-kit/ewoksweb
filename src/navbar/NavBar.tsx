import { Link, useLocation } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import useStore from '../store/useStore';
import useWorkflowToRestore from '../store/useWorkflowToRestore';
import type { Link as RFLink } from '../types';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const { pathname } = useLocation();

  const rfInstance = useReactFlow();
  const setWorkflowToRestore = useWorkflowToRestore((state) => state.setGraph);
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  const setElement = useNavBarElementStore((state) => state.setElement);

  function saveWorkingWorkflow() {
    if (displayedWorkflowInfo.id) {
      setWorkflowToRestore({
        graph: displayedWorkflowInfo,
        nodes: rfInstance.getNodes(),
        links: rfInstance.getEdges() as RFLink[],
      });
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
        <Link
          className={styles.link}
          data-selected={pathname === '/edit' || undefined}
          to="/edit"
        >
          Edit
        </Link>
        <Link
          className={styles.link}
          data-selected={pathname === '/monitor' || undefined}
          to="/monitor"
          onClick={saveWorkingWorkflow}
        >
          Monitor
        </Link>
      </nav>
    </div>
  );
}

export default NavBar;
