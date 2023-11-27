import { Delete, FileCopy, LibraryAdd } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import type { Node } from 'reactflow';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../../../api/tasks';
import TaskForm from '../../../general/forms/TaskForm';
import { useNodesIds } from '../../../store/graph-hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import useStore from '../../../store/useStore';
import type { RFNode } from '../../../types';
import { getNodeData } from '../../../utils';
import { calcNewId } from '../../../utils/calcNewId';
import {
  assertDefined,
  assertNodeDataDefined,
} from '../../../utils/typeGuards';

interface NodeSidebarMenuProps {
  selectedElement: Node;
  onClose: () => void;
}

export default function NodeSidebarMenu(props: NodeSidebarMenuProps) {
  const { selectedElement, onClose } = props;
  const rfInstance = useReactFlow();

  const nodesIds = useNodesIds();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const tasks = useTasks();
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const nodeData = getNodeData(selectedElement.id);
  assertNodeDataDefined(nodeData, selectedElement.id);
  const nodeTask = tasks.find(
    (tas) => tas.task_identifier === nodeData.task_props.task_identifier,
  );

  function cloneNode() {
    const nodeToClone = rfInstance.getNode(selectedElement.id);
    assertDefined(nodeToClone);

    const clone: RFNode = {
      ...nodeToClone,
      id: calcNewId(selectedElement.id, nodesIds),
      selected: false,
      position: {
        x: nodeToClone.position.x + 100,
        y: nodeToClone.position.y + 100,
      },
      data: {},
    };

    rfInstance.addNodes(clone);
    assertNodeDataDefined(nodeData, selectedElement.id);
    setNodeData(clone.id, nodeData);
    onClose();
  }

  return (
    <>
      <TaskForm
        isOpen={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        elementToEdit={nodeTask}
      />
      <MenuItem
        onClick={cloneNode}
        role="menuitem"
        disabled={rootWorkflowId !== displayedWorkflowInfo.id}
      >
        <ListItemIcon>
          <LibraryAdd fontSize="small" />
        </ListItemIcon>
        <ListItemText>Clone Node</ListItemText>
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
          rfInstance.deleteElements({ nodes: [selectedElement] });
          onClose();
        }}
        role="menuitem"
        disabled={rootWorkflowId !== displayedWorkflowInfo.id}
      >
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Node</ListItemText>
      </MenuItem>
    </>
  );
}
