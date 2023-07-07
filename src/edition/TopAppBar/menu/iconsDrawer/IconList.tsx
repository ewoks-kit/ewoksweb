import { Paper, Tooltip } from '@material-ui/core';
import type { Icon } from '../../../../types';

import styles from './ManageIcons.module.css';

interface Props {
  icons: Icon[];
  selectedIcon: string;
  setSelectedIcon: (name: string) => void;
}

function IconList(props: Props) {
  const { icons, selectedIcon, setSelectedIcon } = props;

  return (
    <Paper className={styles.iconList}>
      {icons
        .filter((icon) => icon.image?.data_url)
        .map((icon) => (
          <button
            className={styles.icon}
            onClick={() => setSelectedIcon(icon.name)}
            key={icon.name}
            type="button"
            data-selected={icon.name === selectedIcon || undefined}
          >
            <Tooltip title={icon.name} arrow>
              <img
                className={styles.iconImg}
                src={icon.image?.data_url}
                alt={icon.name}
              />
            </Tooltip>
          </button>
        ))}
    </Paper>
  );
}

export default IconList;
