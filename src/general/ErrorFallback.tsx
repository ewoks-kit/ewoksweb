import { Button } from '@material-ui/core';
import type { PropsWithChildren } from 'react';
import type { FallbackProps } from 'react-error-boundary';

import { hasMessage } from '../utils/typeGuards';

function prepareReport(message: string): string {
  return `Hi,

  I encountered the following error in Ewoks-UI:

  - ${message}

  Here is some additional context:

  - User agent: ${navigator.userAgent}
  - << Please provide as much information as possible (beamline, file or dataset accessed, etc.) >>

  Thanks,
  << Name >>`;
}

function ErrorFallback(props: PropsWithChildren<FallbackProps>) {
  const { error, resetErrorBoundary, children } = props;

  const message = hasMessage(error) ? error.message : 'Unknown error';

  return (
    <div role="alert" style={{ padding: '1.5rem' }}>
      <p>Something went wrong:</p>
      <pre style={{ color: 'var(--bs-danger)' }}>{message}</pre>
      <p>
        <Button
          style={{ margin: '4px' }}
          variant="outlined"
          color="primary"
          onClick={() => resetErrorBoundary()}
        >
          Try again
        </Button>{' '}
        <Button
          style={{ margin: '4px' }}
          variant="outlined"
          color="primary"
          target="_blank"
          href={`mailto:data-analysis@esrf.fr?subject=Error%20report&body=${encodeURIComponent(
            prepareReport(message),
          )}`}
          size="small"
        >
          Report issue
        </Button>
      </p>
      {children}
    </div>
  );
}

export default ErrorFallback;
