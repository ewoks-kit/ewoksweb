import { useState, useEffect } from 'react';
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
  Task,
  FormAction,
  PropertyChangedEvent,
  stateRFwithGraph,
} from '../../types';
import { rfToEwoks, textForError } from '../../utils';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import useStore from '../../store/useStore';
import commonStrings from '../../commonStrings.json';
import {
  getTaskDescription,
  postWorkflow,
  postTask,
  putTask,
  putWorkflow,
} from '../../api/api';
import IconControl from './IconControl';
import { assertStr } from '../../utils/typeGuards';
import IconBoundary from '../../IconBoundary';

interface FormDialogProps {
  elementToEdit: Task | stateRFwithGraph;
  action: FormAction;
  open: boolean;
  setOpenSaveDialog: Dispatch<SetStateAction<boolean>>;
}

export default function FormDialog(props: FormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [taskType, setTaskType] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('');
  const [optionalInputNames, setOptionalInputNames] = useState<string[]>([]);
  const [requiredInputNames, setRequiredInputNames] = useState<string[]>([]);
  const [outputNames, setOutputNames] = useState<string[]>([]);
  const [overwrite, setOverwrite] = useState<boolean>(false);

  const setCanvasGraphChanged = useStore((st) => st.setCanvasGraphChanged);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const resetRecentGraphs = useStore((state) => state.resetRecentGraphs);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setGettingFromServer = useStore((st) => st.setGettingFromServer);
  const [element, setElement] = useState<Task | stateRFwithGraph>({});
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
    // TODO: check on the optional of 'graph' in GraphRF that will enable type inferencing
    if ('task_identifier' in elementToEdit) {
      setNewName(elementToEdit.task_identifier || '');
      setTaskType(elementToEdit.task_type || '');
      setCategory(elementToEdit.category || '');
      setIcon(elementToEdit.icon || '');
      setOptionalInputNames(elementToEdit.optional_input_names || []);
      setRequiredInputNames(elementToEdit.required_input_names || []);
      setOutputNames(elementToEdit.output_names || []);
    }
  }, [open, action, elementToEdit, isForGraph]);

  async function handleSave() {
    // DOC: get the selected element (graph or Node) give a new name before saving
    if ('edges' in element && isForGraph && newName) {
      saveGraph(element);
    } else if ('task_identifier' in element && newName) {
      if (['cloneTask', 'newTask'].includes(action) && element) {
        saveTask(element);
        return;
      }

      if (action === 'editTask') {
        updateTask(element);
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please give a name!',
        severity: 'warning',
      });
    }
  }

  async function updateTask(task: Task) {
    if (!task.task_identifier) {
      setOpenSnackbar({
        open: true,
        text: 'The task has no task-identifier. Please try again!',
        severity: 'warning',
      });
      return;
    }

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
        text: textForError(error, commonStrings.savingError),
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
        text: 'Task saved successfully',
        severity: 'success',
      });

      props.setOpenSaveDialog(false);

      const tasksNew = await getTaskDescription();

      setTasks(tasksNew.data.items);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.savingError),
        severity: 'warning',
      });
    }
  }

  async function saveGraph(graph: stateRFwithGraph) {
    if (overwrite) {
      // put
      try {
        await putWorkflow(rfToEwoks(graph));

        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'Graph saved successfully!',
          severity: 'success',
        });
        setCanvasGraphChanged(false);
      } catch (error) {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.savingError),
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

        props.setOpenSaveDialog(false);

        setWorkingGraph(responseNew.data, 'fromServer');

        resetRecentGraphs();

        setOpenSnackbar({
          open: true,
          text: 'Graph saved successfully!',
          severity: 'success',
        });
      } catch (error) {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.savingError),
          severity: 'error',
        });
      }
    }
  }

  function newNameChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setNewName(val);

    if ('graph' in element) {
      setElement({
        ...element,
        graph: { ...element.graph, id: val, label: val },
      });
    } else {
      // TODO: does not infer type
      setElement({
        ...element,
        task_identifier: val,
      });
    }
  }

  function taskTypeChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
    setTaskType(val);
    setElement({
      ...element,
      task_type: val,
    });
  }

  function categoryChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
    setCategory(val);

    setElement({
      ...element,
      category: val,
    });
  }

  function iconChanged(event: PropertyChangedEvent) {
    const { value } = event.target;
    assertStr(value);
    setIcon(value);
    setElement({
      ...element,
      icon: value,
    });
  }

  function optionalInputNamesChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
    setOptionalInputNames(val.split(','));
    setElement({
      ...element,
      optional_input_names: val.split(','),
    });
  }

  function requiredInputNamesChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
    setRequiredInputNames(val.split(','));
    setElement({
      ...element,
      required_input_names: val.split(','),
    });
  }

  function outputNamesChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
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
  const fields: {
    id: string;
    value: string | string[];
    handleChange: (event: PropertyChangedEvent) => void;
    tip?: string;
  }[] = [
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
          inputProps={{ 'aria-labelledby': 'saveAsName-label' }}
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
          <IconBoundary>
            <IconControl value={icon} onChange={iconChanged} />
          </IconBoundary>
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
