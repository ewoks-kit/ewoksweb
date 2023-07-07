import { Settings } from '@material-ui/icons';
import ActionMenuItem from './ActionMenuItem';

interface Props {
  handleOpenSettings: () => void;
}

function OpenDrawerMenuItem(props: Props) {
  const { handleOpenSettings } = props;
  return (
    <ActionMenuItem
      icon={Settings}
      label="Settings"
      onClick={handleOpenSettings}
    />
  );
}

export default OpenDrawerMenuItem;
