import { useState } from 'react';
import { useIcons } from 'api/icons';
import IconList from './IconList';
import IconControls from './IconControls';

import styles from './ManageIcons.module.css';

export default function ManageIcons() {
  const [selectedIcon, setSelectedIcon] = useState('');

  const { icons } = useIcons();

  return (
    <div className={styles.container}>
      <div>
        <IconList
          icons={icons}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />

        <IconControls selectedIcon={selectedIcon} />
      </div>
    </div>
  );
}
