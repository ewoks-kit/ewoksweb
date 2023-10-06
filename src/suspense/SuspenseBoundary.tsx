import type { ReactNode } from 'react';
import { Suspense } from 'react';
import type { ErrorBoundaryProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';

import Spinner from '../general/Spinner';
import SnackbarErrorFallback from './SnackbarErrorFallback';

interface Props {
  children?: ReactNode;
  FallbackComponent?: ErrorBoundaryProps['FallbackComponent'];
}

function SuspenseBoundary(props: Props) {
  const { children, FallbackComponent } = props;

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent || SnackbarErrorFallback}
    >
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default SuspenseBoundary;
