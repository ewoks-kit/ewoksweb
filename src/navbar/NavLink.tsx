import { Link, type LinkProps, useRoute } from 'wouter';
import styles from './NavBar.module.css';
import { type PropsWithChildren } from 'react';

interface Props {
  href: string;
  searchParams?: Record<string, string>;
  state?: LinkProps['state'];
}

function NavLink(props: PropsWithChildren<Props>) {
  const { children, href, searchParams = {}, state } = props;
  const [isActive] = useRoute(href);
  const query = new URLSearchParams(searchParams).toString();

  return (
    <Link
      className={styles.link}
      aria-current={isActive || undefined}
      href={query ? `${href}?${query}` : href}
      state={state}
    >
      {children}
    </Link>
  );
}

export default NavLink;
