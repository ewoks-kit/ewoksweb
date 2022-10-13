import Popover from '@material-ui/core/Popover';
import SaveGetFromDisk from '../Components/SaveGetFromDisk';

export default function MenuPopover({ anchorEl, handleClose }) {
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <SaveGetFromDisk />
      </Popover>
    </div>
  );
}
