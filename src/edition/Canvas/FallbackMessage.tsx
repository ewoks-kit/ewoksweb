import { createStyles, makeStyles } from '@material-ui/core';

import { useNodesLength } from '../../store/graph-hooks';
import useStore from '../../store/useStore';

const useStyles = makeStyles(() =>
  createStyles({
    noWorkflowMessage: {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(calc(-50% - 1rem))',
      left: '30%',
      zIndex: 1000,
      color: '#3f51b5',
      opacity: '0.5',
      textAlign: 'center',
      pointerEvents: 'none', // Let RF events go through the message
    },
  })
);

export default function FallbackMessage() {
  const classes = useStyles();

  const nodesCount = useNodesLength();
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  return (
    <div className={classes.noWorkflowMessage}>
      {nodesCount === 0 && rootWorkflowId === '' && (
        <p>
          <strong>Drag and drop</strong> tasks here to start building your
          workflow,
          <br />
          or use <em>Quick Open</em> to <strong>open</strong> an existing
          workflow.
        </p>
      )}
    </div>
  );
}
