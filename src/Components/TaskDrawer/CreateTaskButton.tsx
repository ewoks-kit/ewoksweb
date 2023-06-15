import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useState } from 'react';
import FormDialog from '../General/FormDialog';
import { initializedTask } from '../../utils/InitializedEntities';
import { FormAction } from '../../types';

function CreateTaskButton() {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  return (
    <>
      <Button
        startIcon={<Add />}
        variant="outlined"
        color="primary"
        onClick={() => setOpenSaveDialog(true)}
        size="small"
      >
        New task
      </Button>
      <FormDialog
        elementToEdit={initializedTask}
        action={FormAction.newTask}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
    </>
  );
}

export default CreateTaskButton;
