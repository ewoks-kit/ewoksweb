import { EditOutlined as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import type { NodeData } from '../../../types';
import TaskIdFormDialog from './TaskIdFormDialog';
import styles from './TaskProperty.module.css';

interface Props {
  nodeData: NodeData;
  nodeId: string;
}

function TaskIdentifier(props: Props) {
  const { nodeData, nodeId } = props;
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
      <SuspenseBoundary>
        <TaskIdFormDialog
          taskId={taskId}
          nodeData={nodeData}
          nodeId={nodeId}
          open={open}
          onDialogClose={handleDialogClose}
        />
      </SuspenseBoundary>
    </>
  );
}
export default TaskIdentifier;
