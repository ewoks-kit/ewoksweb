import { Link, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import useStore from '../store/useStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const setElement = useNavBarElementStore((state) => state.setElement);
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

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
          data-selected={pathname.startsWith('/edit') || undefined}
          to={
            window.history.state?.usr?.workflow
              ? `/edit?workflow=${
                  window.history.state?.usr?.workflow as string
                }`
              : searchParams.get('workflow')
              ? `/edit?workflow=${searchParams.get('workflow') as string}`
              : '/edit'
          }
        >
          Edit
        </Link>

        <Link
          className={styles.link}
          data-selected={pathname.startsWith('/monitor') || undefined}
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
