import { Link, type LinkProps, useRoute } from 'wouter';
import styles from './NavBar.module.css';
import { type PropsWithChildren } from 'react';

interface Props {
  to: string;
  state?: LinkProps['state'];
}

function NavLink(props: PropsWithChildren<Props>) {
  const { children, to, state } = props;
  const paths = to.split('?');
  const [isActive] = useRoute(paths[0]);

  return (
    <Link
      className={styles.link}
      aria-current={isActive ? 'true' : undefined}
      to={to}
      state={state}
    >
      {children}
    </Link>
  );
}

export default NavLink;
