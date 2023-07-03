import { IconButton } from '@material-ui/core';
import { ViewModule, ViewList } from '@material-ui/icons';
import type { SidebarLayout } from '../../types';
import CreateTaskButton from './CreateTaskButton';

interface Props {
  onLayoutChange: (layout: SidebarLayout) => void;
}

function TaskListToolbar(props: Props) {
  const { onLayoutChange } = props;

  return (
    <div>
      <CreateTaskButton />

      <IconButton
        onClick={() => onLayoutChange('grid')}
        aria-label="Switch to grid layout"
      >
        <ViewModule />
      </IconButton>
      <IconButton
        onClick={() => onLayoutChange('list')}
        aria-label="Switch to list layout"
      >
        <ViewList />
      </IconButton>
    </div>
  );
}

export default TaskListToolbar;
