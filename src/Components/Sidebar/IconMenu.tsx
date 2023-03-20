import React from 'react';

import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Button, Menu, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import FormDialog from '../General/FormDialog';
import type { EwoksRFLink, EwoksRFNode, GraphDetails, Task } from '../../types';
import useStore from '../../store/useStore';
import { FormAction } from '../../types';
import { useSelectedElement } from '../../store/graph-hooks';
import useNodeDataStore from '../../store/useNodeDataStore';

export default function IconMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
  const [elementToEdit, setElementToEdit] = React.useState<Task | GraphDetails>(
    {}
  );
  const [doAction, setDoAction] = React.useState<FormAction>(
    FormAction.newTask
  );
  const selectedElement = useSelectedElement();
  const initializedTask = useStore((state) => state.initializedTask);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const graphInfo = useStore((state) => state.graphInfo);
  const tasks = useStore((state) => state.tasks);
  const nodesData = useNodeDataStore((state) => state.nodesData);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function onAction(
    action: FormAction,
    element: Task | EwoksRFNode | EwoksRFLink | GraphDetails
  ) {
    setDoAction(action);
    const nodeData = nodesData.get(selectedElement.id);
    switch (action) {
      case 'newTask': {
        setElementToEdit(initializedTask);
        break;
      }
      case 'cloneTask': {
        // TODO: check for using isNode by extending each possible types
        if ('position' in element) {
          if (nodeData?.task_props.task_type === 'graph') {
            setOpenSnackbar({
              open: true,
              text: 'Cannot clone a graph, please select a Task!',
              severity: 'warning',
            });
            return;
          }
          // DOC: if the task does not exist in the tasks populate the form with the element details
          const task = tasks.find(
            (tas) =>
              tas.task_identifier === nodeData?.task_props.task_identifier
          );

          setElementToEdit(
            task || {
              ...initializedTask,
              task_identifier: nodeData?.task_props.task_identifier,
              task_type: nodeData?.task_props.task_type,
            }
          );
        } else {
          setOpenSnackbar({
            open: true,
            text: 'First select in the canvas a Node to clone and Save as Task',
            severity: 'warning',
          });
          return;
        }

        break;
      }
      case 'cloneGraph': {
        setElementToEdit(graphInfo);
        break;
      }
      default: {
        break;
      }
    }

    setOpenSaveDialog(true);
  }

  return (
    <>
      <FormDialog
        elementToEdit={elementToEdit}
        action={doAction}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
      <Tooltip title="Clone or create task/workflow" arrow>
        <Button
          style={{ margin: '8px' }}
          variant="contained"
          color="primary"
          onClick={handleClick}
          size="small"
          data-cy="iconMenu"
        >
          <MenuIcon />
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Paper>
          <MenuList>
            <MenuItem
              onClick={() => onAction(FormAction.newTask, initializedTask)}
            >
              <ListItemIcon>
                <FiberNewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Task</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => onAction(FormAction.cloneTask, selectedElement)}
            >
              <ListItemIcon>
                <FileCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone as Task</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => onAction(FormAction.cloneGraph, graphInfo)}
            >
              <ListItemIcon>
                <FileCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Clone Graph</ListItemText>
              <Typography variant="body2" color="primary" />
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </>
  );
}
