import { Publish } from '@material-ui/icons';
import { useState } from 'react';
import DiscoverTasksDialog from './DiscoverMenuDialog';
import MoreMenuItem from './MoreMenuItem';

function DiscoverMenuItem() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <DiscoverTasksDialog open={isOpen} onClose={() => setOpen(false)} />
      <MoreMenuItem
        icon={Publish}
        label="Import tasks"
        onClick={() => setOpen(true)}
      />
    </>
  );
}

export default DiscoverMenuItem;
