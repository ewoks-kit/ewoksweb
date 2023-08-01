import { Typography } from '@material-ui/core';
import { createPortal } from 'react-dom';

import GetWorkflowFromServerDropdown from '../../general/GetWorkflowFromServerDropdown';
import OpenActionMenuButton from './menu/OpenActionMenuButton';
import SaveToServerButton from './SaveToServerButton';
import TopAppBarLabel from './TopAppBarLabel';
import useNavBarElementStore from '../../navbar/useNavBarElementStore';

import styles from './TopAppBar.module.css';

function TopAppBar() {
  const navBarElement = useNavBarElementStore((state) => state.element);

  if (!navBarElement) {
    return null;
  }

  return createPortal(
    <>
      <Typography component="h1" variant="h6" color="inherit" noWrap>
        <TopAppBarLabel />
      </Typography>
      <div className={styles.toolbar}>
        <GetWorkflowFromServerDropdown />
        <SaveToServerButton />
        <OpenActionMenuButton />
      </div>
    </>,
    navBarElement
  );
}

export default TopAppBar;
