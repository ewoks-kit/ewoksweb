import Typography from '@material-ui/core/Typography';
import DashboardStyle from '../Dashboard/DashboardStyle';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';

import Link from '@material-ui/core/Link';
import useStore from '../../store/useStore';
import { useReactFlow } from 'reactflow';
import useSelectedElementStore from '../../store/useSelectedElementStore';
import useNodeDataStore from '../../store/useNodeDataStore';

const useStyles = DashboardStyle;

export default function SubgraphsStack() {
  const classes = useStyles();

  const { setNodes, setEdges } = useReactFlow();

  const recentGraphs = useStore((state) => state.recentGraphs);
  const setGraphInfo = useStore((state) => state.setGraphInfo);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const subgraphsStack = useStore((state) => {
    return state.subgraphsStack;
  });
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const setSelectedElement = useSelectedElementStore(
    (state) => state.setSelectedElement
  );
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
      subgraph.nodes.forEach((nod) => {
        setNodeData(nod.id, nod.data);
      });
      setEdges(subgraph.links);
      setGraphInfo(subgraph.graph);
      setSelectedElement({ type: 'graph', id: subgraph.graph.id });
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
      <Breadcrumbs aria-label="breadcrumb" color="secondary">
        {subgraphsStack.length > 1 &&
          subgraphsStack.map((gr, index) => (
            <span key={gr.id}>
              {index === 0 && <HomeIcon className={classes.icon} />}
              <Link
                underline="hover"
                color="textPrimary"
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
      {subgraphsStack.length === 1 && (
        <span data-cy={subgraphsStack[0].label}>{subgraphsStack[0].label}</span>
      )}
    </Typography>
  );
}
