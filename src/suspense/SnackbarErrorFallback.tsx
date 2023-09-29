import type { FallbackProps } from 'react-error-boundary';
import useSnackbarStore from '../store/useSnackbarStore';
import { textForError } from '../utils';

function SnackbarErrorFallback(props: FallbackProps) {
  const { error } = props;

  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const text = textForError(error, 'Error when contacting the server.');
  showErrorMsg(text);

  return <p style={{ color: 'darkred' }}>{text}</p>;
}

export default SnackbarErrorFallback;
