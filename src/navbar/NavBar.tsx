import { unstable_usePrompt } from 'react-router-dom';
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { useIsChanged } from '../store/graph-hooks';
import useStore from '../store/useStore';
import useWorkflowChanges from '../store/useWorkflowChangesStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const resetWorkflowChange = useWorkflowChanges(
    (st) => st.resetWorkflowChange,
  );

  const isWorkflowEdited = useIsChanged();

  unstable_usePrompt({
    message: 'There are unsaved changes. Continue without saving?',
    when: ({ currentLocation, nextLocation }) =>
      isWorkflowEdited &&
      nextLocation.pathname === '/monitor' &&
      currentLocation.pathname !== nextLocation.pathname,
  });

  const setElement = useNavBarElementStore((st) => st.setElement);
  const displayedWorkflowInfo = useStore((st) => st.displayedWorkflowInfo);

  const linkIsActive = (isActive: boolean) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  function goToMonitor(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    navigate('/monitor', {
      state: { workflow: displayedWorkflowInfo.id },
    });
    resetWorkflowChange();
  }

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
          className={({ isActive }) => {
            return linkIsActive(isActive);
          }}
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
          className={({ isActive }) => {
            return linkIsActive(isActive);
          }}
          to="/monitor"
          onClick={goToMonitor}
        >
          Monitor
        </NavLink>
      </nav>
    </div>
  );
}

export default NavBar;
