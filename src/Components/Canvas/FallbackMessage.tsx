import { createStyles, makeStyles } from '@material-ui/core';
import { useNodesLength } from '../../store/graph-hooks';
import useStore from '../../store/useStore';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    noWorkflowMessage: {
      position: 'fixed',
      left: '30%',
      // Vertical centering minus `1rem` to compensate for the visual illusion that items that are perfectly centered don't seem to be
      top: '50%',
      transform: 'translateY(calc(-50% - 1rem))',

      width: '20%',
      height: '20%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      color: '#3f51b5',
      opacity: '0.5',
      textAlign: 'center',
    },
  })
);

export default function FallbackMessage() {
  const classes = useStyles();

  const nodesCount = useNodesLength();
  const workingGraphId = useStore((state) => state.workingGraph.graph.id);

  return (
    <div className={classes.noWorkflowMessage}>
      {nodesCount === 0 && workingGraphId === '' && (
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
