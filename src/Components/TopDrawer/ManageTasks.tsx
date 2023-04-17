import { Button, Grid } from '@material-ui/core';
import AddNodes from '../Sidebar/AddNodes';
import { useState } from 'react';
import DiscoverTasksForm from './DiscoverTasksForm';
import { Add } from '@material-ui/icons';

export default function ManageTasks() {
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);

  function openDialogNew() {
    setOpenSaveDialog(true);

    setTimeout(() => {
      setOpenSaveDialog(false);
    }, 100);
  }

  return (
    <Grid container spacing={1} direction="row" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={5} className="dndflow">
        <AddNodes title="Tasks" openSaveDialogNewtask={openSaveDialog} />
      </Grid>
      <Grid item xs={12} sm={4} md={3} lg={2} className="dndflow">
        <Button
          startIcon={<Add />}
          style={{ margin: '4px' }}
          variant="outlined"
          color="primary"
          onClick={openDialogNew}
          size="small"
        >
          Create a new task
        </Button>
      </Grid>
      <DiscoverTasksForm />
    </Grid>
  );
}
