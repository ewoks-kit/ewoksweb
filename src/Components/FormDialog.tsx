/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import type {
  EwoksRFLink,
  EwoksRFNode,
  GraphEwoks,
  GraphRF,
  Task,
} from '../types';
import { rfToEwoks } from '../utils';
import state from '../store/state';
import configData from '../configData.json';
import {
  getTaskDescription,
  postWorkflow,
  postTask,
  putTask,
  putWorkflow,
} from '../utils/api';

export default function FormDialog(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [taskType, setTaskType] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [optionalInputNames, setOptionalInputNames] = React.useState(
    [] as string[]
  );
  const [requiredInputNames, setRequiredInputNames] = React.useState(
    [] as string[]
  );
  const [outputNames, setOutputNames] = React.useState([] as string[]);
  const [overwrite, setOverwrite] = React.useState<boolean>(false);

  const selectedElement = state<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const setCanvasGraphChanged = state((st) => st.setCanvasGraphChanged);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const allIconNames = state((state) => state.allIconNames);
  const setGettingFromServer = state((st) => st.setGettingFromServer);
  const [element, setElement] = React.useState<Task | GraphRF>(
    {} as Task | GraphRF
  );
  const setTasks = state((state) => state.setTasks);
  const tasks = state((state) => state.tasks);

  const { open, action, elementToEdit } = props;

  const isForGraph = ['cloneGraph', 'newGraph', 'newGraphOrOverwrite'].includes(
    action
  );

  useEffect(() => {
    setElement(elementToEdit);
    setIsOpen(open);
    if (isForGraph) {
      setNewName(elementToEdit.label || '');
      setOverwrite(false);
    } else {
      setNewName(elementToEdit.task_identifier);
      setTaskType(elementToEdit.task_type);
      setCategory(elementToEdit.category);
      setIcon(elementToEdit.icon);
      setOptionalInputNames(elementToEdit.optional_input_names);
      setRequiredInputNames(elementToEdit.required_input_names);
      setOutputNames(elementToEdit.output_names);
    }
  }, [open, action, elementToEdit, isForGraph]);

  const handleSave = async () => {
    // get the selected element (graph or Node) give a new name before saving
    if (isForGraph) {
      saveGraph(element as GraphRF);
    } else if (['cloneTask', 'newTask'].includes(action)) {
      saveTask(element as Task);
    } else if (['editTask'].includes(action)) {
      puTask(element as Task);
    }
  };

  const puTask = async (task: Task) => {
    try {
      await putTask(task);

      setOpenSnackbar({
        open: true,
        text: 'Task saved successfuly',
        severity: 'success',
      });
      props.setOpenSaveDialog(false);
      const tasksNew = await getTaskDescription();
      const tasks = tasksNew.data as { items: Task[] };
      setTasks(tasks.items);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || configData.savingError,
        severity: 'warning',
      });
    }
    // }
  };

  const saveTask = async (task) => {
    if (tasks.some((ts) => ts.task_identifier === task.task_identifier)) {
      setOpenSnackbar({
        open: true,
        text: 'Please rename the Task so as to be unique!',
        severity: 'warning',
      });
      return;
    }
    try {
      await postTask(task);
      setOpenSnackbar({
        open: true,
        text: 'Task saved successfuly',
        severity: 'success',
      });
      props.setOpenSaveDialog(false);
      const tasksNew = await getTaskDescription();
      const tasks = tasksNew.data as { items: Task[] };
      setTasks(tasks.items);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || configData.savingError,
        severity: 'warning',
      });
    }
  };

  const saveGraph = async (graph) => {
    if (overwrite) {
      // put
      try {
        await putWorkflow(rfToEwoks(graph));

        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'Graph saved succesfully!',
          severity: 'success',
        });
        setCanvasGraphChanged(false);
      } catch (error) {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: error.response?.data?.message || configData.savingError,
          severity: 'error',
        });
      } finally {
        props.setOpenSaveDialog(false);
      }
    } else {
      try {
        const responseNew = await postWorkflow(
          rfToEwoks({
            ...graph,
            graph: { ...graph.graph, id: newName, label: newName },
          })
        );
        setGettingFromServer(false);
        const savedGraph = responseNew.data as GraphEwoks;
        props.setOpenSaveDialog(false);
        setWorkingGraph(savedGraph, 'fromServer');
        setRecentGraphs({} as GraphRF, true);
        setOpenSnackbar({
          open: true,
          text: 'Graph saved succesfully!',
          severity: 'success',
        });
      } catch (error) {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: error.response?.data?.message || configData.savingError,
          severity: 'error',
        });
      }
    }
  };

  const newNameChanged = (event) => {
    const val = event.target.value;
    setNewName(val);
    if ('graph' in selectedElement) {
      const el = element as GraphRF;
      setElement({
        ...el,
        graph: { ...el.graph, id: val, label: val },
      });
    } else {
      setElement({
        ...element,
        task_identifier: val,
      });
    }
  };

  const taskTypeChanged = (event) => {
    const val = event.target.value;
    setTaskType(val);
    setElement({
      ...element,
      task_type: val,
    });
  };

  const categoryChanged = (event) => {
    const val = event.target.value;
    setCategory(val);

    setElement({
      ...element,
      category: val,
    });
  };

  const iconChanged = (event) => {
    const val = event.target.value;
    setIcon(val);
    setElement({
      ...element,
      icon: val,
    });
  };

  const optionalInputNamesChanged = (event) => {
    const val = event.target.value;
    setOptionalInputNames(val.split(','));
    setElement({
      ...element,
      optional_input_names: val.split(','),
    });
  };

  const requiredInputNamesChanged = (event) => {
    const val = event.target.value;
    setRequiredInputNames(val.split(','));
    setElement({
      ...element,
      required_input_names: val.split(','),
    });
  };

  const outputNamesChanged = (event) => {
    const val = event.target.value;
    setOutputNames(val.split(','));
    setElement({
      ...element,
      output_names: val.split(','),
    });
  };

  const handleClose = () => {
    props.setOpenSaveDialog(false);
    setGettingFromServer(false);
    setNewName('');
  };

  const task_types = ['class', 'method', 'script', 'ppfmethod', 'ppfport'];
  const optionalInputs = 'Optional Inputs';
  const requiredInputs = 'Required Inputs';
  const outputs = 'Outputs';
  const fields = [
    { id: 'Task Type', value: taskType, handleChange: taskTypeChanged },
    { id: 'Category', value: category, handleChange: categoryChanged },
    // { id: 'Icon', value: icon, handleChange: iconChanged },
    {
      id: optionalInputs,
      value: optionalInputNames,
      handleChange: optionalInputNamesChanged,
      tip: 'Give the optional inputs in comma separated values eg: op1,op2...',
    },
    {
      id: requiredInputs,
      value: requiredInputNames,
      handleChange: requiredInputNamesChanged,
      tip:
        'Give the required inputs in comma separated values eg: req1,req2...',
    },
    {
      id: outputs,
      value: outputNames,
      handleChange: outputNamesChanged,
      tip: 'Give the outputs in comma separated values eg: out1,out2...',
    },
  ];

  const overwriteChanged = (event) => {
    setOverwrite(event.target.checked);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        {action === 'editTask' ? 'Edit the ' : 'Give the new '}
        {isForGraph ? 'Workflow name' : 'Task details'}
        {action === 'newGraphOrOverwrite' &&
          ` or select to overwrite the existing with id: ${
            elementToEdit.graph.id as string
          }`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          The {isForGraph ? 'Workflow' : 'Task'} will be saved to file with the
          name-identifier you will provide.
        </DialogContentText>
        <TextField
          margin="dense"
          id="saveAsName"
          label="New Name - Identifier"
          fullWidth
          variant="standard"
          value={newName}
          onChange={newNameChanged}
          disabled={action === 'editTask' || overwrite}
        />
        {action === 'newGraphOrOverwrite' && (
          <div>
            <b>Overwrite existing workflow with the same ID</b>
            <Checkbox
              checked={overwrite}
              onChange={overwriteChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        )}
        {!isForGraph &&
          fields.map((field) => (
            <Tooltip title={field.tip || ''} key={field.id} arrow>
              {field.id === 'Task Type' ? (
                <FormControl>
                  <InputLabel id="demo-simple-select-helper-label">
                    Task Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={field.value}
                    label="Task Type"
                    onChange={field.handleChange}
                  >
                    {task_types.map((type) => (
                      <MenuItem value={type} key={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select from the available types
                  </FormHelperText>
                </FormControl>
              ) : (
                <TextField
                  margin="dense"
                  id={field.id}
                  label={field.id}
                  fullWidth
                  variant="standard"
                  // DOC: apply rules of Issue #7 on value and disabling fields
                  value={
                    ['method', 'script'].includes(taskType) &&
                    field.id === outputs
                      ? 'return_value'
                      : field.value
                  }
                  onChange={field.handleChange}
                  disabled={
                    [optionalInputs, requiredInputs, outputs].includes(
                      field.id
                    ) && taskType !== 'class'
                  }
                />
              )}
            </Tooltip>
          ))}
        {!isForGraph && (
          <FormControl>
            <InputLabel id="demo-simple-select-helper-label">Icon</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={icon}
              label="Icon"
              onChange={iconChanged}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {allIconNames.map((iconName) => (
                <MenuItem value={iconName} key={iconName}>
                  {iconName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select from the existing icons or upload a new one
            </FormHelperText>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>
          Save {isForGraph ? 'Workflow' : 'Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
