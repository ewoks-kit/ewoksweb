import { useState } from 'react';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Button, Menu, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import FormDialog from '../General/FormDialog';
import type {
  EwoksRFNode,
  GraphDetails,
  SelectedElementRF,
  Task,
} from '../../types';
import useStore from '../../store/useStore';
import { FormAction } from '../../types';
import { assertNodeDataDefined, isNodeRF } from '../../utils/typeGuards';
import { getNodeData } from '../../utils';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useReactFlow } from 'reactflow';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { deleteWorkflow } from 'api/api';
import commonStrings from 'commonStrings.json';
import { textForError } from '../../utils';
import { getNodesData } from '../../utils';
import { calcNewId } from 'utils/calcNewId';
import { useNodesIds } from '../../store/graph-hooks';
import useNodeDataStore from '../../store/useNodeDataStore';
import type { Node, Edge } from 'reactflow';

export default function IconMenu({ selectedElement }: SelectedElementRF) {
  const rfInstance = useReactFlow();

  const nodesIds = useNodesIds();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [elementToEdit, setElementToEdit] = useState<Task | GraphDetails>({});
  const [doAction, setDoAction] = useState<FormAction>(FormAction.cloneTask);

  const initializedGraph = useStore((state) => state.initializedGraph);
  const initGraph = useStore((state) => state.initGraph);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);

  const initializedTask = useStore((state) => state.initializedTask);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const graphInfo = useStore((state) => state.graphInfo);
  const tasks = useStore((state) => state.tasks);
  const workingGraph = useStore((state) => state.workingGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function onAction(action: FormAction, element?: Node | Edge | undefined) {
    setDoAction(action);

    switch (action) {
      case 'cloneTask': {
        if (!element || !isNodeRF(element)) {
          setOpenSnackbar({
            open: true,
            text: 'First select in the canvas a Node to create a new Task',
            severity: 'warning',
          });
          return;
        }
        const nodeData = getNodeData(element.id);
        assertNodeDataDefined(nodeData, element.id);

        if (nodeData.task_props.task_type === 'graph') {
          setOpenSnackbar({
            open: true,
            text:
              'Cannot clone a sub-workflow as a Task, please select a Node!',
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
        break;
      }
      case 'cloneGraph': {
        if (!workingGraph.graph.id) {
          setOpenSnackbar({
            open: true,
            text:
              'No Workflow to clone! Please open a workflow that you need to clone first.',
            severity: 'success',
          });
          return;
        }
        setElementToEdit(graphInfo);
        break;
      }
      default: {
        break;
      }
    }

    setOpenSaveDialog(true);
  }

  const deleteElement = async () => {
    if (!workingGraph.graph.id) {
      setOpenSnackbar({
        open: true,
        text: 'No workflow on canvas to delete!',
        severity: 'success',
      });
      return;
    }
    if (workingGraph.graph.id !== graphInfo.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to delete any element in a sub-workflow!',
        severity: 'success',
      });
      return;
    }

    if (!selectedElement) {
      setOpenAgreeDialog(true);
      return;
    }

    if (isNodeRF(selectedElement)) {
      const node = rfInstance
        .getNodes()
        .find((nod) => nod.id === selectedElement.id);

      rfInstance.deleteElements({ nodes: [{ id: node?.id || '' }] });
      return;
    }

    const edge: Edge | undefined = rfInstance
      .getEdges()
      .find((edg) => edg.id === selectedElement.id);
    rfInstance.deleteElements({ edges: [edge] as Edge[] });
  };

  const agreeCallback = async () => {
    setOpenAgreeDialog(false);
    if (graphInfo.id) {
      try {
        await deleteWorkflow(graphInfo.id);
        setOpenSnackbar({
          open: true,
          text: `Workflow ${graphInfo.id} successfully deleted!`,
          severity: 'success',
        });
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.deletingError),
          severity: 'error',
        });
      }
    }

    initGraph(initializedGraph, undefined, rfInstance);
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  const cloneNode = () => {
    if (!selectedElement || !isNodeRF(selectedElement)) {
      setOpenSnackbar({
        open: true,
        text: 'Clone is for cloning nodes within the working workflow',
        severity: 'warning',
      });
      return;
    }

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
  };

  return (
    <>
      <FormDialog
        elementToEdit={elementToEdit}
        action={doAction}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
      <Tooltip title="Delete, Clone" arrow>
        <Button
          style={{
            margin: '2px 20px 8px 8px',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            color: 'rgb(108, 128, 236)',
          }}
          variant="contained"
          color="primary"
          onClick={handleClick}
          size="small"
          aria-controls="editSidebar-dropdown-menu"
        >
          <MenuIcon />
        </Button>
      </Tooltip>
      <Menu
        id="editSidebar-dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* <Paper> */}
        <MenuList>
          {!selectedElement && (
            <MenuItem
              onClick={() => onAction(FormAction.cloneGraph)}
              role="sidebarMenuItem"
            >
              <ListItemIcon>
                <FileCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone Workflow</ListItemText>
              <Typography variant="body2" color="primary" />
            </MenuItem>
          )}
          {selectedElement && isNodeRF(selectedElement) && (
            <>
              <MenuItem onClick={cloneNode} role="sidebarMenuItem">
                <ListItemIcon>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Clone Node</ListItemText>
                <Typography variant="body2" color="primary" />
              </MenuItem>

              <MenuItem
                onClick={() => onAction(FormAction.cloneTask, selectedElement)}
                role="sidebarMenuItem"
              >
                <ListItemIcon>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Create Task from Node</ListItemText>
              </MenuItem>
            </>
          )}
          <MenuItem
            onClick={() => {
              deleteElement();
            }}
            role="sidebarMenuItem"
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              Delete{' '}
              {!selectedElement
                ? 'Workflow'
                : isNodeRF(selectedElement)
                ? 'Node'
                : 'Link'}
            </ListItemText>
            <Typography variant="body2" color="primary" />
          </MenuItem>
        </MenuList>
      </Menu>
      <ConfirmDialog
        // TODO: Here maybe it is better to see the label and id.
        title={`Delete workflow with id: "${
          !selectedElement && graphInfo.id
        }"?`}
        content={`You are about to delete the workflow with id: "${
          !selectedElement && graphInfo.id
        }".
              Please make sure that it is not used as a subgraph in other workflows!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeCallback}
        disagreeCallback={disAgreeCallback}
      />
    </>
  );
}
