import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const { pathname } = useLocation();

  const setElement = useNavBarElementStore((state) => state.setElement);

  return (
    <div
      className={styles.topbar}
      ref={(elem) => setElement(elem ?? undefined)}
    >
      <nav className={styles.navbar}>
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
        >
          Monitor
        </Link>
      </nav>
    </div>
  );
}

export default NavBar;
