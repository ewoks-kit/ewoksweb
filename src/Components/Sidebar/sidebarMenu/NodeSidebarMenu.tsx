import { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import type { EwoksRFNode, Task } from '../../../types';
import useStore from '../../../store/useStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import { getNodeData } from '../../../utils';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../../../utils';
import { calcNewId } from 'utils/calcNewId';
import { useNodesIds } from '../../../store/graph-hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import type { Node } from 'reactflow';
import TaskForm from '../../General/taskform/TaskForm';

export default function NodeSidebarMenu(selectedElement: Node) {
  const rfInstance = useReactFlow();

  const nodesIds = useNodesIds();

  const initializedTask = useStore((state) => state.initializedTask);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const graphInfo = useStore((state) => state.graphInfo);
  const tasks = useStore((state) => state.tasks);
  const workingGraph = useStore((state) => state.workingGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [elementToEdit, setElementToEdit] = useState<Task>();

  function cloneAsTask() {
    const nodeData = getNodeData(selectedElement.id);
    assertNodeDataDefined(nodeData, selectedElement.id);

    // TBD: we can also deactivate the cloneAsTask if a sugraph is selected
    // but allowing the warning informs the user too.
    if (nodeData.task_props.task_type === 'graph') {
      setOpenSnackbar({
        open: true,
        text: 'Cannot clone a sub-workflow as a Task, please select a Node!',
        severity: 'warning',
      });
      return;
    }
    // DOC: if the task does not exist in the tasks populate the form with the element details
    const task = tasks.find(
      (tas) => tas.task_identifier === nodeData.task_props.task_identifier
    );

    setElementToEdit(
      task || {
        ...initializedTask,
        task_identifier: nodeData.task_props.task_identifier,
        task_type: nodeData.task_props.task_type,
      }
    );
    setOpenSaveDialog(true);
  }

  async function deleteNode(isnode: Node) {
    rfInstance.deleteElements({ nodes: [{ id: isnode.id || '' }] });
  }

  function cloneNode() {
    const nodes = rfInstance.getNodes();
    const clonedNode = nodes.find((nod) => nod.id === selectedElement.id);

    if (!clonedNode) {
      setOpenSnackbar({
        open: true,
        text: 'Cannot locate the node to clone',
        severity: 'warning',
      });
      return;
    }

    const clonedNodeData = getNodesData().get(selectedElement.id);
    assertNodeDataDefined(clonedNodeData, selectedElement.id);
    const newClone: EwoksRFNode = {
      ...clonedNode,
      id: calcNewId(clonedNode.id, nodesIds),
      selected: false,
      position: {
        x: (clonedNode.position.x || 0) + 100,
        y: (clonedNode.position.y || 0) + 100,
      },
    };

    rfInstance.setNodes([...nodes, newClone]);
    setNodeData(newClone.id, clonedNodeData);
  }

  return (
    <>
      <TaskForm
        isOpen={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        elementToEdit={elementToEdit}
      />
      <MenuItem
        onClick={cloneNode}
        role="sidebarMenuItem"
        disabled={workingGraph.graph.id !== graphInfo.id}
      >
        <ListItemIcon>
          <FileCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Clone Node</ListItemText>
        <Typography variant="body2" color="primary" />
      </MenuItem>

      <MenuItem
        onClick={() => cloneAsTask()}
        role="sidebarMenuItem"
        disabled={workingGraph.graph.id !== graphInfo.id}
      >
        <ListItemIcon>
          <FileCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Create Task from Node</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          deleteNode(selectedElement);
        }}
        role="sidebarMenuItem"
        disabled={workingGraph.graph.id !== graphInfo.id}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Node</ListItemText>
        <Typography variant="body2" color="primary" />
      </MenuItem>
    </>
  );
}
