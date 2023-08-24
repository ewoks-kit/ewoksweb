import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import useStore from '../../store/useStore';
import type { Task } from '../../types';
import { textForError } from '../../utils';
import { useInvalidateTasks } from '../../api/tasks';
import IconDropdown from './IconDropdown';
import type { TaskFields } from './models';
import { TASK_TYPES } from './models';
import commonStrings from '../../commonStrings.json';

import styles from './TaskForm.module.css';
import { submitTaskFormData } from './utils';
import FormField from './FormField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  elementToEdit?: Task;
  editExistingTask?: boolean;
}

function TaskForm(props: Props) {
  const { isOpen, onClose, elementToEdit, editExistingTask } = props;
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const invalidateTasks = useInvalidateTasks();

  const {
    control,
    handleSubmit,
    watch,
    formState,
    reset,
    setValue,
  } = useForm<TaskFields>({
    defaultValues: {
      task_identifier: elementToEdit?.task_identifier || '',
      task_type: elementToEdit?.task_type || '',
      category: elementToEdit?.category || '',
      required_input_names: String(elementToEdit?.required_input_names || []),
      optional_input_names: String(elementToEdit?.optional_input_names || []),
      output_names: String(elementToEdit?.output_names || []),
      icon: elementToEdit?.icon || '',
    },
  });
  const onSubmit = handleSubmit(async (data: TaskFields) => {
    try {
      await submitTaskFormData(data, elementToEdit, editExistingTask);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.savingError),
        severity: 'warning',
      });
      return;
    }

    reset();
    onClose();
    invalidateTasks();
  });
  const taskType = watch('task_type');

  // Task type specific behaviour as described in https://gitlab.esrf.fr/workflow/ewoks/ewoksweb/-/issues/7:
  // 1. `method` and `script` have specific output names
  useEffect(() => {
    if (taskType === 'method') {
      setValue('output_names', 'return_value');
    }

    if (taskType === 'script') {
      setValue('output_names', 'return_code');
    }
  }, [setValue, taskType]);
  // 2. inputs/outputs fields should only be enabled for `class`
  const disableIO = taskType !== 'class';

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {`${editExistingTask ? `Edit` : `Create`} task`}
        </DialogTitle>
        <DialogContent>
          {formState.errors.task_identifier && (
            <Alert severity="error">Please give a task identifier !</Alert>
          )}
          {formState.errors.task_type && (
            <Alert severity="error">Please give a task type !</Alert>
          )}
          <DialogContentText>
            The Task will be saved to the server with the identifier you
            provide.
          </DialogContentText>
          <Controller
            name="task_identifier"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormField
                disabled={editExistingTask}
                label="Identifier"
                {...field}
              />
            )}
          />
          <Controller
            name="task_type"
            control={control}
            rules={{ required: true, minLength: 4 }}
            render={({ field }) => {
              const { onChange, ...restField } = field;

              return (
                <FormControl className={styles.dropdown}>
                  <InputLabel id="taskTypeInFormDialog">Task type</InputLabel>
                  <Select
                    labelId="taskTypeInFormDialog"
                    // @ts-expect-error
                    onChange={onChange}
                    {...restField}
                  >
                    {TASK_TYPES.map((type) => (
                      <MenuItem value={type} key={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => <FormField label="Category" {...field} />}
          />
          <Controller
            name="required_input_names"
            control={control}
            render={({ field }) => (
              <FormField
                label="Required inputs"
                disabled={disableIO}
                tooltip="Give the inputs as comma separated values eg: op1,op2..."
                {...field}
              />
            )}
          />
          <Controller
            name="optional_input_names"
            control={control}
            render={({ field }) => (
              <FormField
                label="Optional inputs"
                disabled={disableIO}
                tooltip="Give the inputs as comma separated values eg: op1,op2..."
                {...field}
              />
            )}
          />
          <Controller
            name="output_names"
            control={control}
            render={({ field }) => (
              <FormField
                label="Outputs"
                disabled={disableIO}
                tooltip="Give the outputs as comma separated values eg: op1,op2..."
                {...field}
              />
            )}
          />
          <SuspenseBoundary>
            <IconDropdown control={control} />
          </SuspenseBoundary>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save Task</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskForm;
