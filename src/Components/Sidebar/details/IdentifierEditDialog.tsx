import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface EditingDialogProps {
  task_identifier: string;
  open: boolean;
  onDialogClose: () => void;
  onPropSave: (value: string) => void;
}

export default function IdentifierEditDialog(props: EditingDialogProps) {
  const { task_identifier, open, onDialogClose, onPropSave } = props;

  const [taskIdentifier, setTaskIdentifier] = useState('');

  useEffect(() => {
    setTaskIdentifier(task_identifier);
  }, [task_identifier]);

  const handleClose = () => {
    props.onDialogClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Change the Task this Node is based on
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The given task identifier will replace the existing in this node and
            change his behavior as well as the links attached to this node.
          </DialogContentText>
          <TextField
            margin="dense"
            id="task_identifier"
            label="Task Identifier"
            type="text"
            fullWidth
            value={taskIdentifier}
            onChange={(event) => setTaskIdentifier(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => onPropSave(taskIdentifier)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
