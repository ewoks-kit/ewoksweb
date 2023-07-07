import { Typography } from '@material-ui/core';
import GetFromServer from '../../general/GetFromServer';
import ProgressBar from '../../general/ProgressBar';
import OpenActionMenuButton from './menu/OpenActionMenuButton';
import SaveToServerButton from './SaveToServerButton';
import TopAppBarLabel from './TopAppBarLabel';

import styles from '../EditPage.module.css';
import { createPortal } from 'react-dom';
import useNavBarElementStore from '../../navbar/useNavBarElementStore';

interface Props {
  checkAndNewGraph: (notSave: boolean) => void;
}

function TopAppBar(props: Props) {
  const { checkAndNewGraph } = props;

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
        <GetFromServer />
        <SaveToServerButton />
        <OpenActionMenuButton
          checkAndNewGraph={() => checkAndNewGraph(false)}
        />
      </div>
      <ProgressBar />
    </>,
    navBarElement
  );
}

export default TopAppBar;
