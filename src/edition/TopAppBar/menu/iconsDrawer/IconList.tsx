import { Paper, Tooltip } from '@material-ui/core';
import { useState } from 'react';
import { useIcons } from '../../../../api/icons';
import DeleteIconButton from './DeleteIconButton';

import styles from './IconsDrawer.module.css';

function IconList() {
  const { icons } = useIcons();

  const [selectedIcon, setSelectedIcon] = useState<string>();

  return (
    <Paper className={styles.iconList}>
      {icons
        .filter((icon) => icon.image?.data_url)
        .map((icon) => (
          <div
            key={icon.name}
            className={styles.icon}
            data-selected={icon.name === selectedIcon || undefined}
          >
            <button
              className={styles.iconButton}
              onClick={() => setSelectedIcon(icon.name)}
              type="button"
              aria-label={icon.name}
            >
              <Tooltip title={icon.name} arrow>
                <img
                  className={styles.iconImg}
                  src={icon.image?.data_url}
                  alt={icon.name}
                />
              </Tooltip>
            </button>
            {icon.name === selectedIcon && (
              <div>
                <span className={styles.iconName}>{icon.name}</span>
                <DeleteIconButton iconName={icon.name} />
              </div>
            )}
          </div>
        ))}
    </Paper>
  );
}

export default IconList;
