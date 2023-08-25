import Tooltip from '@material-ui/core/Tooltip';
import { DynamicFeed } from '@material-ui/icons';
import TaskButton from './TaskButton';

import styles from './TaskList.module.css';

function AddSubworkflow() {
  return (
    <Tooltip title="Drag to the canvas to add a subworkflow node" arrow>
      <div className={styles.item}>
        <TaskButton
          taskInfo={{
            task_type: 'subworkflow',
            task_identifier: 'subworkflow',
          }}
          label="Subworkflow"
          icon={() => <DynamicFeed fontSize="large" />}
        />
      </div>
    </Tooltip>
  );
}

export default AddSubworkflow;
