import { Link, useSearchParams } from 'wouter';

import useWorkflowStore from '../store/useWorkflowStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';
import { useHistoryState } from 'wouter/use-browser-location';
import NavLink from './NavLink';
import { isString } from '../utils/typeGuards';

function NavBar() {
  const state = useHistoryState();
  const [searchParams] = useSearchParams();

  const setElement = useNavBarElementStore((st) => st.setElement);
  const displayedWorkflowInfo = useWorkflowStore((st) => st.workflowInfo);

  const workflow = state?.workflow || searchParams.get('workflow');

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
          href="/edit"
          searchParams={isString(workflow) ? { workflow } : {}}
        >
          Edit
        </NavLink>
        <NavLink href="/monitor" state={{ workflow: displayedWorkflowInfo.id }}>
          Monitor
        </NavLink>
      </nav>
    </div>
  );
}

export default NavBar;
