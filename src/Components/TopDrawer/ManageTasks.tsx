import { Button, Grid } from '@material-ui/core';
import AddNodes from '../AddNodesDrawer/AddNodes';
import { useState } from 'react';
import { Add } from '@material-ui/icons';
import FormDialog from '../General/FormDialog';
import { initializedTask } from '../../utils/InitializedEntities';
import { FormAction } from '../../types';

export default function ManageTasks() {
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);

  function openDialogNew() {
    setOpenSaveDialog(true);
  }

  return (
    <Grid container spacing={1} direction="row" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <AddNodes showManagementButtons />
      </Grid>
      <Grid item xs={12} sm={8} md={6} lg={5}>
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
      <FormDialog
        elementToEdit={initializedTask}
        action={FormAction.newTask}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
    </Grid>
  );
}
