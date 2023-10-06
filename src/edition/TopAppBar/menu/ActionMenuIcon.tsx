import type { SvgIcon } from '@material-ui/core';
import { ListItemIcon } from '@material-ui/core';

import styles from './ActionMenu.module.css';

interface Props {
  icon: typeof SvgIcon;
}

function ActionMenuIcon(props: Props) {
  const { icon: Icon } = props;

  return (
    <ListItemIcon className={styles.icon}>
      <Icon fontSize="small" />
    </ListItemIcon>
  );
}

export default ActionMenuIcon;
