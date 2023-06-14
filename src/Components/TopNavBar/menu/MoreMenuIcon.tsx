import { ListItemIcon } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';
import styles from './MoreMenu.module.css';

interface Props {
  icon: typeof SvgIcon;
}

function MoreMenuIcon(props: Props) {
  const { icon: Icon } = props;

  return (
    <ListItemIcon className={styles.icon}>
      <Icon fontSize="small" />
    </ListItemIcon>
  );
}

export default MoreMenuIcon;
