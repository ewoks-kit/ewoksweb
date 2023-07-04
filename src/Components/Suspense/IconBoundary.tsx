import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import Spinner from '../General/Spinner';
import SnackbarErrorFallback from './SnackbarErrorFallback';

interface Props {
  children?: ReactNode;
}

function IconBoundary(props: Props) {
  const { children } = props;

  return (
    <ErrorBoundary FallbackComponent={SnackbarErrorFallback}>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default IconBoundary;
