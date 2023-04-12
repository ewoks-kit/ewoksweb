import { Button, Grid, TextField } from '@material-ui/core';
import useStore from '../../store/useStore';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { useState } from 'react';
import { discoverTasks } from '../../api/api';
import commonStrings from '../../commonStrings.json';
import type { SnackbarParams } from '../../types';
import { textForError } from '../../utils';

export default function DiscoverTasksForm() {
  const setOpenSnackbar = useStore<(params: SnackbarParams) => void>(
    (state) => state.setOpenSnackbar
  );
  const [textValue, setTextValue] = useState<string>('');

  async function discover() {
    if (!textValue) {
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
    <Grid item xs={12} sm={4} md={3} lg={2} className="dndflow">
      Import tasks from a module
      <TextField
        margin="dense"
        label="Module name"
        fullWidth
        variant="standard"
        value={textValue}
        onChange={(event) => setTextValue(event.target.value)}
      />
      <Button
        startIcon={<EventNoteIcon />}
        style={{ margin: '8px' }}
        variant="outlined"
        color="primary"
        onClick={() => {
          discover();
        }}
        size="small"
      >
        Import
      </Button>
    </Grid>
  );
}
