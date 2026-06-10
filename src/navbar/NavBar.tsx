import { Link, useSearchParams } from 'wouter';

import useWorkflowStore from '../store/useWorkflowStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';
import { useHistoryState } from 'wouter/use-browser-location';

function NavBar() {
  const state = useHistoryState();
  const [searchParams] = useSearchParams();

  const setElement = useNavBarElementStore((st) => st.setElement);
  const displayedWorkflowInfo = useWorkflowStore((st) => st.workflowInfo);

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
          className={(active) => (active ? styles.activeLink : styles.link)}
          to={`/edit${
            state?.workflow
              ? `?workflow=${state.workflow as string}`
              : searchParams.get('workflow')
                ? `?workflow=${searchParams.get('workflow') as string}`
                : ''
          }`}
        >
          Edit
        </Link>
        <Link
          className={(active) => (active ? styles.activeLink : styles.link)}
          to="/monitor"
          state={{ workflow: displayedWorkflowInfo.id }}
        >
          Monitor
        </Link>
      </nav>
    </div>
  );
}

export default NavBar;
