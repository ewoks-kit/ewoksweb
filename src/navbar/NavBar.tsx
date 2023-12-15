import { Link, useLocation } from 'react-router-dom';

import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const { pathname } = useLocation();

  const setElement = useNavBarElementStore((state) => state.setElement);

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
          to="/edit"
        >
          Edit
        </Link>
        <Link
          className={styles.link}
          data-selected={pathname.startsWith('/monitor') || undefined}
          to="/monitor"
        >
          Monitor
        </Link>
      </nav>
    </div>
  );
}

export default NavBar;
