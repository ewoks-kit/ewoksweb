import { ListItemIcon } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';

interface Props {
  icon: typeof SvgIcon;
}

function MoreMenuIcon(props: Props) {
  const { icon: Icon } = props;

  return (
    <ListItemIcon style={{ minWidth: 0, paddingRight: '1rem' }}>
      <Icon fontSize="small" />
    </ListItemIcon>
  );
}

export default MoreMenuIcon;
