import {
  Button,
  Grid,
  Tooltip,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import state from '../store/state';
import AddNodes from './AddNodes';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { useState } from 'react';
import { discoverTasks } from '../utils/api';
import configData from '../configData.json';

export default function ManageTasks() {
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const [pythonModules, setPythonModules] = useState<string[]>([]);
  const [showDiscover, setShowDiscover] = useState<boolean>(false);

  const discoverTasksChanged = (event) => {
    setShowDiscover(event.target.checked);
  };

  const pythonModuleChanged = (event) => {
    setPythonModules([event.target.value]);
  };

  const discover = async () => {
    console.log(pythonModules, typeof pythonModules);
    try {
      await discoverTasks(pythonModules);
      setOpenSnackbar({
        open: true,
        text: 'Task saved successfuly',
        severity: 'success',
      });
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || configData.savingError,
        severity: 'warning',
      });
    }
  };

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      // justifyContent="flex-start"
      alignItems="center"
    >
      <Grid item xs={12} sm={8} md={6} lg={5} className="dndflow">
        <AddNodes title="Tasks" />
      </Grid>
      <Grid item xs={12} sm={4} md={3} lg={2} className="dndflow">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showDiscover}
                onChange={discoverTasksChanged}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Task Discovery"
          />
        </FormGroup>
      </Grid>
      {showDiscover && (
        <Grid item xs={12} sm={4} md={3} lg={2} className="dndflow">
          <Tooltip
            title="Input the module to discover the containing tasks."
            arrow
          >
            <TextField
              margin="dense"
              // id={field.id}
              label="Module name"
              fullWidth
              variant="standard"
              value={pythonModules[0]}
              onChange={pythonModuleChanged}
            />
          </Tooltip>
          <Button
            startIcon={<EventNoteIcon />}
            style={{ margin: '8px' }}
            variant="outlined"
            color="primary"
            onClick={discover}
            size="small"
          >
            Discover Tasks
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
