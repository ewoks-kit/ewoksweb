import { NavLink, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import useStore from '../store/useStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const setElement = useNavBarElementStore((st) => st.setElement);
  const displayedWorkflowInfo = useStore((st) => st.displayedWorkflowInfo);

  const linkIsActive = (isActive: boolean) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

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
          className={({ isActive }) => linkIsActive(isActive)}
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
          className={({ isActive }) => linkIsActive(isActive)}
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
