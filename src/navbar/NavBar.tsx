import { Link, useSearchParams } from 'wouter';

import useWorkflowStore from '../store/useWorkflowStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';
import { useHistoryState } from 'wouter/use-browser-location';
import NavLink from './NavLink';

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
        <NavLink
          to={`/edit${
            state?.workflow
              ? `?workflow=${state.workflow as string}`
              : searchParams.get('workflow')
                ? `?workflow=${searchParams.get('workflow') as string}`
                : ''
          }`}
        >
          Edit
        </NavLink>
        <NavLink to="/monitor" state={{ workflow: displayedWorkflowInfo.id }}>
          Monitor
        </NavLink>
      </nav>
    </div>
  );
}

export default NavBar;
