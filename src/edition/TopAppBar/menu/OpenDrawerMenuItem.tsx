import { PermMedia } from '@material-ui/icons';
import { useState } from 'react';

import ActionMenuItem from './ActionMenuItem';
import IconsDrawer from './iconsDrawer/IconsDrawer';

function OpenDrawerMenuItem() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <ActionMenuItem
        icon={PermMedia}
        label="Manage icons"
        onClick={() => setOpen(true)}
      />
      <IconsDrawer isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
}

export default OpenDrawerMenuItem;
