import { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import type { EwoksRFNode } from '../../../types';
import useStore from '../../../store/useStore';
import {
  assertDefined,
  assertNodeDataDefined,
} from '../../../utils/typeGuards';
import { getNodeData } from '../../../utils';
import { Delete, FileCopy, LibraryAdd } from '@material-ui/icons';
import { useReactFlow } from 'reactflow';
import { calcNewId } from 'utils/calcNewId';
import { useNodesIds } from '../../../store/graph-hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import type { Node } from 'reactflow';
import TaskForm from '../../../general/forms/TaskForm';

export default function NodeSidebarMenu(selectedElement: Node) {
  const rfInstance = useReactFlow();

  const nodesIds = useNodesIds();

  const graphInfo = useStore((state) => state.graphInfo);
  const tasks = useStore((state) => state.tasks);
  const workingGraph = useStore((state) => state.workingGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const nodeData = getNodeData(selectedElement.id);
  assertNodeDataDefined(nodeData, selectedElement.id);
  const nodeTask = tasks.find(
    (tas) => tas.task_identifier === nodeData.task_props.task_identifier
  );

  function cloneNode() {
    const nodeToClone = rfInstance.getNode(selectedElement.id);
    assertDefined(nodeToClone);

    const clone: EwoksRFNode = {
      ...nodeToClone,
      id: calcNewId(selectedElement.id, nodesIds),
      selected: false,
      position: {
        x: nodeToClone.position.x + 100,
        y: nodeToClone.position.y + 100,
      },
    };

    rfInstance.addNodes(clone);
    assertNodeDataDefined(nodeData, selectedElement.id);
    setNodeData(clone.id, nodeData);
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
        role="sidebarMenuItem"
        disabled={workingGraph.graph.id !== graphInfo.id}
      >
        <ListItemIcon>
          <LibraryAdd fontSize="small" />
        </ListItemIcon>
        <ListItemText>Clone Node</ListItemText>
      </MenuItem>

      {nodeData.task_props.task_type !== 'graph' && (
        <MenuItem
          onClick={() => setOpenSaveDialog(true)}
          role="sidebarMenuItem"
          disabled={workingGraph.graph.id !== graphInfo.id}
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
        }}
        role="sidebarMenuItem"
        disabled={workingGraph.graph.id !== graphInfo.id}
      >
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Node</ListItemText>
      </MenuItem>
    </>
  );
}
