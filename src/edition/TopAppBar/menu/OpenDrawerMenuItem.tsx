import { PermMedia } from '@material-ui/icons';
import { useState } from 'react';
import IconsDrawer from './iconsDrawer/IconsDrawer';
import ActionMenuItem from './ActionMenuItem';

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
