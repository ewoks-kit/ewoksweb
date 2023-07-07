import Drawer from '@material-ui/core/Drawer';
import ManageIcons from '../TopDrawer/ManageIcons';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';

interface SettingsInfoDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export default function SettingsInfoDrawer(props: SettingsInfoDrawerProps) {
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
