import axios from 'axios';
import type { FallbackProps } from 'react-error-boundary';

import styles from './MonitorPageFallback.module.css';

function MonitorPageFallback(props: FallbackProps) {
  const { error } = props;

  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.status === 500
  ) {
    return (
      <div className={styles.fallback}>
        <p>
          The server encountered an internal error when fetching execution
          events. It is likely that the <code>ewoksserver</code> instance is not
          configured to handle execution events.
        </p>
        <p>
          If you set up the instance yourself, you can see how to configure{' '}
          <code>ewoksserver</code> appropriately{' '}
          <a href="https://ewoksserver.readthedocs.io/en/latest/configuration.html#ewoks-events">
            here
          </a>
          .
        </p>
      </div>
    );
  }

  return <p className={styles.fallback}>{props.error.message}</p>;
}

export default MonitorPageFallback;
