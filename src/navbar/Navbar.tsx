import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.title}>EwoksWeb</div>
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
  );
}

export default NavBar;
