import { Add } from '@mui/icons-material';
import { useState } from 'react';

import TaskForm from '../../../general/forms/TaskForm';
import ActionMenuItem from './ActionMenuItem';

function NewTaskMenuItem() {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  return (
    <>
      <ActionMenuItem
        icon={Add}
        label="Create new task"
        onClick={() => setOpenSaveDialog(true)}
      />
      <TaskForm
        isOpen={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
      />
    </>
  );
}

export default NewTaskMenuItem;
