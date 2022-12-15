import type { Dispatch, SetStateAction } from 'react';
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
import type { ChangeEvent } from 'react';
import type { GraphRF, Task, FormAction } from '../../types';
import { rfToEwoks } from '../../utils';
import useStore from '../../store/useStore';
import commonStrings from '../../commonStrings.json';
import {
  getTaskDescription,
  postWorkflow,
  postTask,
  putTask,
  putWorkflow,
} from '../../utils/api';

interface FormDialogProps {
  elementToEdit: Task | GraphRF;
  action: FormAction;
  open: boolean;
  setOpenSaveDialog: Dispatch<SetStateAction<boolean>>;
}

export default function FormDialog(props: FormDialogProps) {
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

  const setCanvasGraphChanged = useStore((st) => st.setCanvasGraphChanged);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const allIcons = useStore((state) => state.allIcons);
  const setGettingFromServer = useStore((st) => st.setGettingFromServer);
  const [element, setElement] = React.useState<Task | GraphRF>(
    {} as Task | GraphRF
  );
  const setTasks = useStore((state) => state.setTasks);
  const tasks = useStore((state) => state.tasks);

  const { open, action, elementToEdit } = props;

  const isForGraph = ['cloneGraph', 'newGraph', 'newGraphOrOverwrite'].includes(
    action
  );

  useEffect(() => {
    setElement(elementToEdit);
    setIsOpen(open);

    if (isForGraph && 'graph' in elementToEdit) {
      setNewName(elementToEdit.graph.label || '');
      setOverwrite(false);
      return;
    }
    // TODO: here it ts should infer the Task type but it does not
    const elTask = elementToEdit as Task;
    setNewName(elTask.task_identifier);
    setTaskType(elTask.task_type);
    setCategory(elTask.category);
    setIcon(elTask.icon);
    setOptionalInputNames(elTask.optional_input_names);
    setRequiredInputNames(elTask.required_input_names);
    setOutputNames(elTask.output_names);
  }, [open, action, elementToEdit, isForGraph]);

  async function handleSave() {
    // DOC: get the selected element (graph or Node) give a new name before saving
    if ('nodes' in element && isForGraph && newName) {
      saveGraph(element);
    } else if ('task_identifier' in element && newName) {
      if (['cloneTask', 'newTask'].includes(action) && element) {
        saveTask(element);
        return;
      }

      if (['editTask'].includes(action)) {
        puTask(element);
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please give a name!',
        severity: 'warning',
      });
    }
  }

  async function puTask(task: Task) {
    try {
      await putTask(task);

      setOpenSnackbar({
        open: true,
        text: 'Task saved successfuly',
        severity: 'success',
      });
      props.setOpenSaveDialog(false);
      const tasksNew = await getTaskDescription();
      setTasks(tasksNew.data.items);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || commonStrings.savingError,
        severity: 'warning',
      });
    }
    // }
  }

  async function saveTask(task: Task) {
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
      const tasksL = tasksNew.data as { items: Task[] };
      setTasks(tasksL.items);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || commonStrings.savingError,
        severity: 'warning',
      });
    }
  }

  async function saveGraph(graph: GraphRF) {
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
          text: error.response?.data?.message || commonStrings.savingError,
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
        const savedGraph = responseNew.data;
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
          text: error.response?.data?.message || commonStrings.savingError,
          severity: 'error',
        });
      }
    }
  }

  function newNameChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setNewName(val);
    if ('graph' in element) {
      const el = element;
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
  }

  function taskTypeChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setTaskType(val);
    setElement({
      ...element,
      task_type: val,
    });
  }

  function categoryChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setCategory(val);

    setElement({
      ...element,
      category: val,
    });
  }

  function iconChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setIcon(val);
    setElement({
      ...element,
      icon: val,
    });
  }

  function optionalInputNamesChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setOptionalInputNames(val.split(','));
    setElement({
      ...element,
      optional_input_names: val.split(','),
    });
  }

  function requiredInputNamesChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setRequiredInputNames(val.split(','));
    setElement({
      ...element,
      required_input_names: val.split(','),
    });
  }

  function outputNamesChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setOutputNames(val.split(','));
    setElement({
      ...element,
      output_names: val.split(','),
    });
  }

  function handleClose() {
    props.setOpenSaveDialog(false);
    setGettingFromServer(false);
    setNewName('');
  }

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

  const overwriteChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setOverwrite(event.target.checked);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        {action === 'editTask' ? 'Edit the ' : 'Give the new '}
        {isForGraph ? 'Workflow name' : 'Task details'}
        {action === 'newGraphOrOverwrite' &&
        'graph' in elementToEdit &&
        elementToEdit.graph.label
          ? ` or select to overwrite the existing with id: ${elementToEdit.graph.label}`
          : ''}
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
        {['newGraphOrOverwrite', 'cloneGraph'].includes(action) && (
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
                  <InputLabel id="taskTypeInFormDialog">Task Type</InputLabel>
                  <Select
                    labelId="taskTypeInFormDialog"
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
            <InputLabel id="iconNameInFormDialog">Icon</InputLabel>
            <Select
              labelId="iconNameInFormDialog"
              value={icon}
              label="Icon"
              onChange={iconChanged}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {allIcons.map((iconL) => (
                <MenuItem value={iconL.name} key={iconL.name}>
                  {iconL.name}
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
        <Button
          onClick={() => {
            handleSave();
          }}
        >
          Save {isForGraph ? 'Workflow' : 'Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
