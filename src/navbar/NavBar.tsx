import { NavLink, useLocation, useSearchParams } from 'react-router-dom';

import useWorkflowStore from '../store/useWorkflowStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const { state } = useLocation();
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
          <NavLink to="/">EwoksWeb</NavLink>
        </div>
        <NavLink
          className={styles.link}
          to={{
            pathname: '/edit',
            search: state?.workflow
              ? `?workflow=${state.workflow as string}`
              : searchParams.get('workflow')
              ? `?workflow=${searchParams.get('workflow') as string}`
              : '',
          }}
        >
          Edit
        </NavLink>
        <NavLink
          className={styles.link}
          to="/monitor"
          state={{ workflow: displayedWorkflowInfo.id }}
        >
          Monitor
        </NavLink>
      </nav>
    </div>
  );
}

export default NavBar;
