import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import useStore from '../store/useStore';

function SimpleSnackbar() {
  const openSnackbar = useStore((state) => state.openSnackbar);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar({
      open: false,
      text: '',
      severity: 'success',
    });
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      open={openSnackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={openSnackbar.text}
      action={action}
    >
      <Alert onClose={handleClose} severity={openSnackbar.severity}>
        {openSnackbar.text}
      </Alert>
    </Snackbar>
  );
}

export default SimpleSnackbar;
