import { useCallback, useEffect, useState } from 'react';
import type { BlockerFunction } from 'react-router-dom';
import {
  NavLink,
  useBlocker,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import ConfirmDialog from '../general/ConfirmDialog';
import { useIsChanged } from '../store/graph-hooks';
import useStore from '../store/useStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const isWorkflowEdited = useIsChanged();

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      isWorkflowEdited && currentLocation.pathname !== nextLocation.pathname,
    [isWorkflowEdited],
  );

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === 'blocked' && isWorkflowEdited) {
      blocker.reset();
    }
  }, [blocker, isWorkflowEdited]);

  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const setElement = useNavBarElementStore((st) => st.setElement);
  const displayedWorkflowInfo = useStore((st) => st.displayedWorkflowInfo);

  const linkIsActive = (isActive: boolean) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  function goToMonitor() {
    navigate('/monitor', {
      state: { workflow: displayedWorkflowInfo.id },
    });
  }

  function handleClickMonitor(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (isWorkflowEdited) {
      setOpenAgreeDialog(true);
      return;
    }

    goToMonitor();
  }

  return (
    <>
      {blocker && ( // .state === 'blocked'
        <ConfirmDialog
          title="There are unsaved changes"
          content="Continue without saving?"
          open={openAgreeDialog}
          setOpen={setOpenAgreeDialog}
          agreeCallback={() => {
            if (blocker.state === 'blocked') {
              blocker.proceed();
            }
            setOpenAgreeDialog(false);
            goToMonitor();
          }}
          disagreeCallback={() => {
            if (blocker.state === 'blocked') {
              blocker.reset();
            }
            setOpenAgreeDialog(false);
          }}
        />
      )}
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
            onClick={handleClickMonitor}
          >
            Monitor
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default NavBar;
