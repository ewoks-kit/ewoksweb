import { Button, Grid } from '@material-ui/core';
import state from '../store/state';
import AddNodes from './AddNodes';
import EventNoteIcon from '@material-ui/icons/EventNote';

export default function ManageTasks() {
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  const discoverTasks = () => {
    setOpenSnackbar({
      open: true,
      text: 'A form for info regarding discovery',
      severity: 'success',
    });
  };

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      // justifyContent="flex-start"
      alignItems="center"
    >
      <Grid item xs={12} sm={8} md={8} lg={5} className="dndflow">
        <AddNodes title="Tasks" />
      </Grid>
      <Grid item xs={12} sm={8} md={8} lg={2} className="dndflow">
        <Button
          startIcon={<EventNoteIcon />}
          style={{ margin: '8px' }}
          variant="outlined"
          color="primary"
          onClick={discoverTasks}
          size="small"
        >
          Discover Tasks
        </Button>
      </Grid>
    </Grid>
  );
}
