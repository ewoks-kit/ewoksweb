import type { FallbackProps } from 'react-error-boundary';
import useStore from '../store/useStore';
import { textForError } from '../utils';

function SnackbarErrorFallback(props: FallbackProps) {
  const { error } = props;

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const text = textForError(error, 'Error when contacting the server.');

  setOpenSnackbar({
    open: true,
    text,
    severity: 'error',
  });

  return <p style={{ color: 'darkred' }}>{text}</p>;
}

export default SnackbarErrorFallback;
