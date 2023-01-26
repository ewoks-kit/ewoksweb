import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import useStore from './store/useStore';
import commonStrings from 'commonStrings.json';
import { textForError } from './utils';

function SnackbarErrorFallback(props: FallbackProps) {
  const { error } = props;

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const text = textForError(error, commonStrings.retrieveIconsError);

  setOpenSnackbar({
    open: true,
    text,
    severity: 'error',
  });

  return <p style={{ color: 'darkred' }}>{text}</p>;
}

interface Props {
  children?: ReactNode;
}

function IconBoundary(props: Props) {
  const { children } = props;

  return (
    <ErrorBoundary FallbackComponent={SnackbarErrorFallback}>
      <Suspense fallback={<>Loading...</>}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default IconBoundary;
