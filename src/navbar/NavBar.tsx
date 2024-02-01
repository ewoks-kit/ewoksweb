import { useState } from 'react';
import {
  NavLink,
  useLocation,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import ConfirmDialog from '../general/ConfirmDialog';
import useWorkflowChanges from '../store/useWorkflowChangesStore';

import useStore from '../store/useStore';
import styles from './NavBar.module.css';
import useNavBarElementStore from './useNavBarElementStore';

function NavBar() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const [isEditActive, setIsEditActive] = useState(true);
  const workflowChanges = useWorkflowChanges((state) => state.workflowChanges);

  const setElement = useNavBarElementStore((st) => st.setElement);
  const displayedWorkflowInfo = useStore((st) => st.displayedWorkflowInfo);

  const linkIsActive = (isActive: boolean) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  function goToMonitor() {
    navigate('/monitor', {
      state: { workflow: displayedWorkflowInfo.id },
    });
  }

  function handleClickMonitor() {
    if (workflowChanges.length > 1) {
      setOpenAgreeDialog(true);
      return;
    }

    goToMonitor();
  }
  return (
    <>
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        setOpen={setOpenAgreeDialog}
        agreeCallback={() => {
          setOpenAgreeDialog(false);
          goToMonitor();
        }}
        disagreeCallback={() => setOpenAgreeDialog(false)}
      />
      <div
        className={styles.navbar}
        ref={(elem) => setElement(elem ?? undefined)}
      >
        <nav className={styles.navlinks}>
          <div className={styles.title}>
            <NavLink to="/">EwoksWeb</NavLink>
          </div>
          {/* this has to be a span as well */}
          <NavLink
            className={({ isActive }) => {
              setIsEditActive(isActive);
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
          <span
            className={linkIsActive(!isEditActive)}
            onClick={handleClickMonitor}
          >
            Monitor
          </span>
        </nav>
      </div>
    </>
  );
}

export default NavBar;
