/* eslint-disable @typescript-eslint/no-misused-promises */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Controller, useForm } from 'react-hook-form';
import FormField from '../../../General/forms/FormField';
import type { TaskFields } from '../../../General/forms/models';
import { Alert } from '@material-ui/lab';

interface EditingDialogProps {
  task_identifier: string;
  open: boolean;
  onDialogClose: () => void;
  onPropSave: (value: string) => void;
}

export default function IdentifierEditDialog(props: EditingDialogProps) {
  const { task_identifier, open, onDialogClose, onPropSave } = props;

  const { control, handleSubmit, formState, reset } = useForm<TaskFields>({
    defaultValues: {
      task_identifier: task_identifier || '',
    },
  });

  const onSubmit = handleSubmit(async (data: Partial<TaskFields>) => {
    onPropSave(data.task_identifier || '');
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
          Change the Task this Node is based on
        </DialogTitle>
        <DialogContent>
          {formState.errors.task_identifier && (
            <Alert severity="error">Please give a task identifier !</Alert>
          )}
          <DialogContentText>
            The given task identifier will replace the existing in this node and
            change his behavior as well as the links attached to this node.
          </DialogContentText>

          <Controller
            name="task_identifier"
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
