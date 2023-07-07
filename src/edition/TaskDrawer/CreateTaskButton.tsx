import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useState } from 'react';
import TaskForm from '../../general/forms/TaskForm';

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
      <TaskForm
        isOpen={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
      />
    </>
  );
}

export default CreateTaskButton;
