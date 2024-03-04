import { Delete, FileCopy, LibraryAdd } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import type { Node } from 'reactflow';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../../../api/tasks';
import TaskForm from '../../../general/forms/TaskForm';
import { useCloneNode } from '../../../general/hooks';
import useStore from '../../../store/useStore';
import { getNodeData } from '../../../utils';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import KeyStrokeHint from '../../KeyStrokeHint';

interface Props {
  node: Node;
  onSelection: () => void;
}

export default function NodeSidebarMenuItems(props: Props) {
  const { node, onSelection } = props;
  const rfInstance = useReactFlow();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const tasks = useTasks();
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const nodeData = getNodeData(node.id);
  assertNodeDataDefined(nodeData, node.id);
  const nodeTask = tasks.find(
    (tas) => tas.task_identifier === nodeData.task_props.task_identifier,
  );
  const cloneNode = useCloneNode();

  return (
    <>
      <TaskForm
        isOpen={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        elementToEdit={nodeTask}
      />
      <MenuItem
        onClick={() => {
          cloneNode(node.id);
          onSelection();
        }}
        role="menuitem"
        disabled={rootWorkflowId !== displayedWorkflowInfo.id}
      >
        <ListItemIcon>
          <LibraryAdd fontSize="small" />
        </ListItemIcon>
        <ListItemText>Duplicate Node</ListItemText>
        <KeyStrokeHint text="Ctrl+D" />
      </MenuItem>

      {nodeData.task_props.task_type !== 'graph' && (
        <MenuItem
          onClick={() => setOpenSaveDialog(true)}
          role="menuitem"
          disabled={rootWorkflowId !== displayedWorkflowInfo.id}
        >
          <ListItemIcon>
            <FileCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Task from Node</ListItemText>
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          rfInstance.deleteElements({ nodes: [node] });
          onSelection();
        }}
        role="menuitem"
        disabled={rootWorkflowId !== displayedWorkflowInfo.id}
      >
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Node</ListItemText>
        <KeyStrokeHint text="Del" />
      </MenuItem>
    </>
  );
}
