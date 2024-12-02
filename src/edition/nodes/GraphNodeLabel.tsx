import { BrokenImageOutlined, OpenInNew } from '@mui/icons-material';
import { useEffect } from 'react';

import { useWorkflowIds } from '../../api/workflows';
import useSnackbarStore from '../../store/useSnackbarStore';
import styles from './GraphNodeLabel.module.css';
import { formatId } from './utils';

interface Props {
  graphId: string;
  label?: string;
}

function GraphNodeLabel(props: Props) {
  const { graphId } = props;
  const workflowIds = useWorkflowIds();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const label = props.label || formatId(graphId);

  const graphNotFound = !workflowIds.has(graphId);

  useEffect(() => {
    if (graphNotFound) {
      showErrorMsg(
        `Workflow with id: ${graphId} is not available in the list of workflows.
        Please provide the workflow (create new or import from disk) by saving it to the server.
        Then the workflow will be complete, able to be executed and correctly visualized on the canvas.`,
        30_000,
      );
    }
  }, [graphId, showErrorMsg, graphNotFound]);

  if (graphNotFound) {
    return (
      <div className={styles.content} style={{ color: 'red' }}>
        {label}
        <BrokenImageOutlined
          className={styles.icon}
          aria-hidden="false"
          aria-label="Workflow not found"
          fontSize="inherit"
        />
      </div>
    );
  }

  const url = `${window.location.origin}${window.location.pathname}?workflow=${graphId}`;

  return (
    <div className={styles.content}>
      <a className={styles.link} href={url} target="blank">
        {label}
        <OpenInNew
          className={styles.icon}
          aria-hidden="false"
          aria-label="Opens in a new tab"
          fontSize="inherit"
        />
      </a>
    </div>
  );
}

export default GraphNodeLabel;
