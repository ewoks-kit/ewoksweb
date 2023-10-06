import Drawer from '@material-ui/core/Drawer';

import SuspenseBoundary from '../../../../suspense/SuspenseBoundary';
import IconList from './IconList';
import styles from './IconsDrawer.module.css';
import UploadIconControl from './UploadIconControl';

interface Props {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export default function IconDrawer(props: Props) {
  const { isOpen, onClose } = props;

  return (
    <Drawer
      className={styles.drawer}
      anchor="top"
      open={isOpen}
      onClose={onClose}
    >
      <div className={styles.content}>
        <div>
          <SuspenseBoundary>
            <IconList />
          </SuspenseBoundary>
          <UploadIconControl />
        </div>
      </div>
    </Drawer>
  );
}
