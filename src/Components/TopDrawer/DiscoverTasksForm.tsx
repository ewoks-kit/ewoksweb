import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import useStore from '../../store/useStore';
import { useState } from 'react';
import { discoverTasks } from '../../api/tasks';
import commonStrings from '../../commonStrings.json';
import type { SnackbarParams } from '../../types';
import { textForError } from '../../utils';

interface Props {
  open: boolean;
  onClose?: () => void;
}

export default function DiscoverTasksDialog(props: Props) {
  const { open, onClose } = props;
  const setOpenSnackbar = useStore<(params: SnackbarParams) => void>(
    (state) => state.setOpenSnackbar
  );
  const [textValue, setTextValue] = useState<string>('');

  async function discover() {
    if (!textValue) {
      setOpenSnackbar({
        open: true,
        text: 'Please provide a module name',
        severity: 'warning',
      });
      return;
    }
    try {
      const { data } = await discoverTasks([textValue]);
      const { identifiers } = data;

      if (identifiers.length === 0) {
        setOpenSnackbar({
          open: true,
          text: 'No tasks found in this module',
          severity: 'warning',
        });
        return;
      }

      setOpenSnackbar({
        open: true,
        text: `${identifiers.length} tasks imported`,
        severity: 'success',
      });
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.savingError),
        severity: 'warning',
      });
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import tasks from a module</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Provide the module name from which tasks will be imported.
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
          Import
        </Button>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
