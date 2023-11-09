import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';

import useSnackbarStore from '../store/useSnackbarStore';

function SimpleSnackbar() {
  const { open, text, severity, autoHideDuration, closeSnackbar } =
    useSnackbarStore();

  const handleClose = (
    event: Event | React.SyntheticEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    closeSnackbar();
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
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      message={text}
      action={action}
    >
      <Alert onClose={handleClose} severity={severity}>
        {text}
      </Alert>
    </Snackbar>
  );
}

export default SimpleSnackbar;
