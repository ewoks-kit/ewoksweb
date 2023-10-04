import { Tooltip } from '@material-ui/core';
import { Textsms } from '@material-ui/icons';
import TaskButton from './TaskButton';

import styles from './TaskList.module.css';

function AddGeneralNodeButton() {
  return (
    <Tooltip title="Drag to the canvas to add an note node" arrow>
      <div className={styles.item}>
        <TaskButton
          taskInfo={{
            task_type: 'note',
            task_identifier: 'note',
          }}
          label="Note"
          icon={() => <Textsms fontSize="large" />}
        />
      </div>
    </Tooltip>
  );
}

export default AddGeneralNodeButton;
