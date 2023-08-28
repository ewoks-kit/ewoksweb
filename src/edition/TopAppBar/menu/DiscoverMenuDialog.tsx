import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import useStore from '../../../store/useStore';
import { useState } from 'react';
import { discoverTasks } from '../../../api/tasks';
import commonStrings from '../../../commonStrings.json';
import { textForError } from '../../../utils';
import { useInvalidateTasks } from '../../../api/tasks';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DiscoverTasksDialog(props: Props) {
  const { open, onClose } = props;
  const showSuccessMsg = useStore((state) => state.showSuccessMsg);
  const showWarningMsg = useStore((state) => state.showWarningMsg);
  const [textValue, setTextValue] = useState<string>('');

  const invalidateTasks = useInvalidateTasks();

  async function discover() {
    if (!textValue) {
      showWarningMsg('Please provide a module name');
      return;
    }
    try {
      const { data } = await discoverTasks([textValue]);
      const { identifiers } = data;

      if (identifiers.length === 0) {
        showWarningMsg('No tasks found in this module');
        return;
      }

      showSuccessMsg(`${identifiers.length} tasks imported.`);
      invalidateTasks();
    } catch (error) {
      showWarningMsg(textForError(error, commonStrings.savingError));
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Discover tasks from a module</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Provide the module name from which tasks will be discovered.
        </DialogContentText>
        <TextField
          margin="dense"
          label="Module name"
          fullWidth
          variant="standard"
          value={textValue}
          onChange={(event) => setTextValue(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              discover();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            discover();
          }}
        >
          Discover
        </Button>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
