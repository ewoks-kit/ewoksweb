import { ViewModule, ViewList } from '@material-ui/icons';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import type { SidebarLayout } from '../../types';
import DiscoverTasksButton from './DiscoverTasksButton';

import styles from './TaskList.module.css';

interface Props {
  layout: SidebarLayout;
  onLayoutChange: (layout: SidebarLayout) => void;
}

function TaskListToolbar(props: Props) {
  const { layout, onLayoutChange } = props;

  return (
    <div className={styles.toolbar}>
      <DiscoverTasksButton />

      <ToggleButtonGroup
        className={styles.layoutBtnContainer}
        value={layout}
        onChange={(e, value) => onLayoutChange(value as SidebarLayout)}
        exclusive
      >
        <ToggleButton
          size="small"
          value="grid"
          aria-label="Switch to grid layout"
        >
          <ViewModule />
        </ToggleButton>
        <ToggleButton
          size="small"
          value="list"
          aria-label="Switch to list layout"
        >
          <ViewList />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default TaskListToolbar;
