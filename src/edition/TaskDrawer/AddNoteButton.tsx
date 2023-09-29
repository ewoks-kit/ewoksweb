import { Tooltip } from '@material-ui/core';
import { Textsms } from '@material-ui/icons';
import TaskButton from './TaskButton';

import styles from './TaskList.module.css';

function AddNoteButton() {
  return (
    <Tooltip title="Drag to the canvas to add a note node" arrow>
      <div className={styles.item}>
        <TaskButton
          taskInfo={{ task_type: 'note', task_identifier: 'note' }}
          label="Note"
          icon={() => <Textsms fontSize="large" />}
        />
      </div>
    </Tooltip>
  );
}

export default AddNoteButton;
