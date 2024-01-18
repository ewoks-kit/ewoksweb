import { EditOutlined as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import type { NodeData } from '../../../types';
import TaskIdFormDialog from './TaskIdFormDialog';
import styles from './TaskProperty.module.css';

interface Props {
  nodeData: NodeData;
  onTaskIdChange: (newTaskId: string, nodeData: NodeData) => void;
}

function TaskIdentifier(props: Props) {
  const { nodeData, onTaskIdChange } = props;
  const { task_identifier: taskId } = nodeData.task_props;

  const [open, setOpen] = useState(false);

  function handleDialogClose() {
    setOpen(false);
  }

  const editable = ['ppfmethod', 'method', 'script'].includes(
    nodeData.task_props.task_type,
  );

  return (
    <>
      <div className={styles.entry} data-cy="task_identifier">
        <span className={styles.label}>Task Identifier:</span> {taskId}
        {editable && (
          <IconButton
            size="small"
            aria-label="edit"
            onClick={() => setOpen(true)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <TaskIdFormDialog
        taskId={taskId}
        open={open}
        onDialogClose={handleDialogClose}
        onTaskIdChange={(newTaskId) => onTaskIdChange(newTaskId, nodeData)}
      />
    </>
  );
}
export default TaskIdentifier;
