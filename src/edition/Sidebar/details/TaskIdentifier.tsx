import { EditOutlined as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useReactFlow } from 'reactflow';

import { useNodesIds } from '../../../store/graph-hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import type { NodeData } from '../../../types';
import { assertNodeDefined } from '../../../utils/typeGuards';
import { generateUniqueNodeId } from '../../../utils/utils';
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

  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const nodesIds = useNodesIds();
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  function handleTaskIdChange(newTaskId: string) {
    // DOC: if the task_identifier changes (ppfmethod, ppfport, script case) then the id
    // of the node needs to change for a coherent json. Links to/from this node also change!
    const newNodeId = generateUniqueNodeId(nodesIds, newTaskId);
    const newNode = getNodes().find((nod) => nod.id === nodeId);
    assertNodeDefined(newNode, nodeId);
    newNode.id = newNodeId;
    setNodes([...getNodes().filter((nod) => nod.id !== nodeId), newNode]);

    const newLinks = getEdges().map((link) => {
      if (link.source === nodeId) {
        return {
          ...link,
          source: newNodeId,
        };
      }

      if (link.target === nodeId) {
        return {
          ...link,
          target: newNodeId,
        };
      }

      return link;
    });
    setEdges(newLinks);

    setNodeData(newNodeId, {
      ...nodeData,
      task_props: {
        ...nodeData.task_props,
        task_identifier: newTaskId,
      },
    });
  }

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
        onTaskIdChange={handleTaskIdChange}
      />
    </>
  );
}
export default TaskIdentifier;
