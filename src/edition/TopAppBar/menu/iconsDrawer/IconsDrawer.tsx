import Drawer from '@material-ui/core/Drawer';
import ManageIcons from './ManageIcons';
import SuspenseBoundary from '../../../../suspense/SuspenseBoundary';

interface Props {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export default function IconDrawer(props: Props) {
  const { isOpen, onClose } = props;

  return (
    <Drawer
      style={{ alignItems: 'center', display: 'flex' }}
      anchor="top"
      open={isOpen}
      onClose={onClose}
    >
      <SuspenseBoundary>
        <ManageIcons />
      </SuspenseBoundary>
    </Drawer>
  );
}
