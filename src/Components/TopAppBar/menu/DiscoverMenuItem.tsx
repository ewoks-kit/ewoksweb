import { Publish } from '@material-ui/icons';
import { useState } from 'react';
import DiscoverTasksDialog from './DiscoverMenuDialog';
import ActionMenuItem from './ActionMenuItem';

function DiscoverMenuItem() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <DiscoverTasksDialog open={isOpen} onClose={() => setOpen(false)} />
      <ActionMenuItem
        icon={Publish}
        label="Discover tasks"
        onClick={() => setOpen(true)}
      />
    </>
  );
}

export default DiscoverMenuItem;
