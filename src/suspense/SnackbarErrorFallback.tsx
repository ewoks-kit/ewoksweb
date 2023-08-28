import type { FallbackProps } from 'react-error-boundary';
import useStore from '../store/useStore';
import { textForError } from '../utils';

function SnackbarErrorFallback(props: FallbackProps) {
  const { error } = props;

  const showErrorMsg = useStore((state) => state.showErrorMsg);

  const text = textForError(error, 'Error when contacting the server.');
  showErrorMsg(text);

  return <p style={{ color: 'darkred' }}>{text}</p>;
}

export default SnackbarErrorFallback;
