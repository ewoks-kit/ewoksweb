import Typography from '@material-ui/core/Typography';
import { useDashboardStyles } from '../Dashboard/useDashboardStyles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import Link from '@material-ui/core/Link';
import useStore from '../../store/useStore';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import useEdgeDataStore from '../../store/useEdgeDataStore';

export default function SubgraphsStack() {
  const classes = useDashboardStyles();

  const { setNodes, setEdges, fitView } = useReactFlow();

  const recentGraphs = useStore((state) => state.recentGraphs);
  const setGraphInfo = useStore((state) => state.setGraphInfo);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const subgraphsStack = useStore((state) => {
    return state.subgraphsStack;
  });

  const setNodesData = useNodeDataStore((state) => state.setNodesData);
  const setEdgesData = useEdgeDataStore((state) => state.setEdgesData);
  const goToGraph = (e: React.MouseEvent) => {
    e.preventDefault();

    const { target } = e;

    if (!(target instanceof Element)) {
      return;
    }

    setSubgraphsStack({
      id: target.id,
      label: (target as HTMLInputElement).value,
    });

    const subgraph = recentGraphs.find((gr) => gr.graph.id === target.id);

    if (subgraph) {
      // Both stay
      setNodes(subgraph.nodes);
      setNodesData(subgraph.nodes);
      setEdges(subgraph.links);
      setEdgesData(subgraph.links);
      setGraphInfo(subgraph.graph);
      setTimeout(() => {
        fitView({ duration: 500 });
      }, 300);
    }
  };

  return (
    <Typography
      component="h1"
      variant="h6"
      color="inherit"
      noWrap
      className={classes.title}
    >
      <Breadcrumbs aria-label="breadcrumb" color="inherit">
        {subgraphsStack.length > 1 &&
          subgraphsStack.map((gr, index) => (
            <span key={gr.id}>
              <Link
                underline="hover"
                style={{ color: 'inherit', fontSize: '18px' }}
                href="/"
                id={gr.id}
                key={gr.id}
                className={
                  index === subgraphsStack.length - 1
                    ? classes.isDisabled
                    : undefined
                }
                onClick={goToGraph}
                data-cy={gr.id}
              >
                {gr.label}
              </Link>
            </span>
          ))}
      </Breadcrumbs>

      {subgraphsStack.length === 0 ||
        (subgraphsStack.length === 1 && subgraphsStack[0].label === '' && (
          <span data-cy="untitled_workflow">
            untitled_workflow{' '}
            <span
              style={{
                fontWeight: 'lighter',
                fontStyle: 'italic',
                fontSize: '1rem',
              }}
            >
              (unsaved)
            </span>
          </span>
        ))}
      {subgraphsStack.length === 1 && (
        <span data-cy={subgraphsStack[0].label}>{subgraphsStack[0].label}</span>
      )}
    </Typography>
  );
}
