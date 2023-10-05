import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { useState } from 'react';

import { discoverTasks } from '../../api/tasks';
import { useInvalidateTasks } from '../../api/tasks';
import commonStrings from '../../commonStrings.json';
import Spinner from '../../general/Spinner';
import useSnackbarStore from '../../store/useSnackbarStore';
import { textForError } from '../../utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DiscoverTasksDialog(props: Props) {
  const { open, onClose } = props;
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const [textValue, setTextValue] = useState('');
  const [discoverAll, setDiscoverAll] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const invalidateTasks = useInvalidateTasks();

  async function discover(moduleNames?: string[]) {
    try {
      setLoading(true);
      const identifiers = await discoverTasks(moduleNames);

      showSuccessMsg(`${identifiers.length} tasks imported.`);
      invalidateTasks();
    } catch (error) {
      showWarningMsg(textForError(error, commonStrings.savingError));
    } finally {
      setLoading(false);
    }
  }

  async function discoverFromModule() {
    if (!textValue) {
      showWarningMsg('Please provide a module name');
      return;
    }

    discover([textValue]);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Discover tasks</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Provide the name of the module from which tasks will be discovered
        </DialogContentText>
        <TextField
          disabled={discoverAll}
          margin="dense"
          label="Module name"
          fullWidth
          variant="standard"
          value={textValue}
          onChange={(event) => setTextValue(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              discoverFromModule();
            }
          }}
          inputProps={{ 'aria-label': 'Module name' }}
        />

        <Checkbox
          color="primary"
          id="discoverAllCheckbox"
          checked={discoverAll}
          onChange={() => {
            setDiscoverAll(!discoverAll);
          }}
        />
        <label htmlFor="discoverAllCheckbox">
          Discover from all modules in the current Python environment
        </label>
      </DialogContent>
      <DialogActions>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Button
              color="primary"
              onClick={() => {
                if (discoverAll) {
                  discover();
                } else {
                  discoverFromModule();
                }
              }}
            >
              Discover
            </Button>

            <Button color="primary" onClick={onClose}>
              Cancel
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
