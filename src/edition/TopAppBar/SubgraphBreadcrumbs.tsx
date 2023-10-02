import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import Link from '@material-ui/core/Link';
import useStore from '../../store/useStore';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import useEdgeDataStore from '../../store/useEdgeDataStore';

import styles from './TopAppBar.module.css';

export default function SubgraphBreadcrumbs() {
  const { setNodes, setEdges, fitView } = useReactFlow();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo
  );
  const setDisplayedWorkflowInfo = useStore(
    (state) => state.setDisplayedWorkflowInfo
  );
  const loadedGraphs = useStore((state) => state.loadedGraphs);
  const subgraphsStack = useStore((state) => state.displayedWorkflowHierarchy);

  const setDataFromNodes = useNodeDataStore((state) => state.setDataFromNodes);
  const setDataFromEdges = useEdgeDataStore((state) => state.setDataFromEdges);

  if (subgraphsStack.length === 1) {
    const { id, label = id } = displayedWorkflowInfo;
    return <span data-cy={label}>{label}</span>;
  }

  const goToGraph = (e: React.MouseEvent) => {
    e.preventDefault();

    const { target } = e;

    if (!(target instanceof Element)) {
      return;
    }

    const subgraph = loadedGraphs.get(target.id);

    if (subgraph) {
      setNodes(subgraph.nodes);
      setDataFromNodes(subgraph.nodes);
      setEdges(subgraph.links);
      setDataFromEdges(subgraph.links);
      setDisplayedWorkflowInfo(subgraph.graph);
      setTimeout(() => {
        fitView({ duration: 500 });
      }, 300);
    }
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" color="inherit">
      {subgraphsStack.map((graphId, index) => {
        const graphLabel = loadedGraphs.get(graphId)?.graph.label || graphId;
        return (
          <span key={graphId}>
            <Link
              underline="hover"
              style={{ color: 'inherit', fontSize: '18px' }}
              href="/"
              id={graphId}
              key={graphId}
              className={
                index === subgraphsStack.length - 1
                  ? styles.disabledCrumb
                  : undefined
              }
              onClick={goToGraph}
              data-cy={graphLabel}
            >
              {graphLabel}
            </Link>
          </span>
        );
      })}
    </Breadcrumbs>
  );
}
