import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import Spinner from './Components/General/Spinner';
import SnackbarErrorFallback from './SnackbarErrorFallback';

interface Props {
  children?: ReactNode;
}

function EventBoundary(props: Props) {
  const { children } = props;

  return (
    <ErrorBoundary FallbackComponent={SnackbarErrorFallback}>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default EventBoundary;
