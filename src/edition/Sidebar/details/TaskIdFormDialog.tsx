import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useReactFlow } from '@xyflow/react';
import { useForm } from 'react-hook-form';

import { useTasks } from '../../../api/tasks';
import { useNodesIds } from '../../../store/graph-hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import type { NodeData } from '../../../types';
import { calcTaskProps } from '../../../utils/convertEwoksWorkflowToRFNodes';
import { assertDefined } from '../../../utils/typeGuards';
import { generateUniqueNodeId } from '../../../utils/utils';
import styles from './TaskIdFormDialog.module.css';

interface Props {
  taskId: string;
  nodeId: string;
  nodeData: NodeData;
  open: boolean;
  onDialogClose: () => void;
}

export default function TaskIdFormDialog(props: Props) {
  const { taskId, nodeId, nodeData, open, onDialogClose } = props;

  const tasks = useTasks();

  const { getNode, getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const nodesIds = useNodesIds();
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const { handleSubmit, formState, register, reset, setError } = useForm<{
    taskId: string;
  }>({
    defaultValues: {
      taskId,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    // DOC: if the task_identifier changes (ppfmethod, ppfport, script case) then the id
    // of the node needs to change for a coherent json. Links to/from this node also change!
    const { taskId: newTaskId } = data;
    const newNodeId = generateUniqueNodeId(nodesIds, newTaskId);
    const newNode = getNode(nodeId);
    assertDefined(newNode);
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

    const newTaskProps = calcTaskProps(newTaskId, tasks);
    if (!newTaskProps) {
      setError('taskId', {
        type: 'custom',
        message: `The task ${newTaskId} does not exist`,
      });
      return;
    }
    setNodeData(newNodeId, {
      ...nodeData,
      task_props: newTaskProps,
    });
    reset();
    onDialogClose();
  });

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={onSubmit}>
        <DialogTitle id="form-dialog-title">
          Change the task this node is based on
        </DialogTitle>
        <DialogContent>
          {formState.errors.taskId && (
            <Alert severity="error">Please give a task identifier !</Alert>
          )}
          <DialogContentText>
            Please select a new task identifier
          </DialogContentText>

          <select
            aria-label="Change task identifier"
            {...register('taskId', { required: true })}
            className={styles.select}
          >
            {tasks.map(({ task_identifier }) => (
              <option value={task_identifier} key={task_identifier}>
                {task_identifier}
              </option>
            ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
