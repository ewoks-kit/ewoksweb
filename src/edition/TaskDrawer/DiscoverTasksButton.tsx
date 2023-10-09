import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useState } from 'react';

import DiscoverTasksDialog from './DiscoverTasksDialog';

function DiscoverTasksButton() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button
        startIcon={<Add />}
        variant="outlined"
        color="primary"
        onClick={() => setOpen(true)}
        size="small"
      >
        Discover tasks
      </Button>
      <DiscoverTasksDialog open={isOpen} onClose={() => setOpen(false)} />
    </>
  );
}

export default DiscoverTasksButton;
