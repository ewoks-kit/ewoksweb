import type { FallbackProps } from 'react-error-boundary';

import styles from './WorkflowItemErrorFallback.module.css';

function WorkflowItemErrorFallback(props: FallbackProps) {
  const { error } = props;

  return (
    <li className={styles.item}>
      <h3>Job cannot be displayed!</h3>
      <p className={styles.error}>Error: {error.message}</p>
      <span>
        Check that the ewoks packages are up-to-date and/or if the event
        database is corrupted.
      </span>
    </li>
  );
}

export default WorkflowItemErrorFallback;
