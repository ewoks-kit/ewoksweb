/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller, useForm } from 'react-hook-form';

import FormField from '../../../general/forms/FormField';

interface Props {
  taskId: string;
  open: boolean;
  onDialogClose: () => void;
  onTaskIdChange: (value: string) => void;
}

export default function TaskIdFormDialog(props: Props) {
  const { taskId, open, onDialogClose, onTaskIdChange } = props;

  const { control, handleSubmit, formState, reset } = useForm<{
    taskId: string;
  }>({
    defaultValues: {
      taskId,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    onTaskIdChange(data.taskId);
    reset();
    onDialogClose();
  });

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={onSubmit}>
        <DialogTitle id="form-dialog-title">
          Change the task this node is based on
        </DialogTitle>
        <DialogContent>
          {formState.errors.taskId && (
            <Alert severity="error">Please give a task identifier !</Alert>
          )}
          <DialogContentText>
            Please give a new task identifier
          </DialogContentText>

          <Controller
            name="taskId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <FormField label="Identifier" {...field} />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
