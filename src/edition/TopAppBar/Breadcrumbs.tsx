import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import Link from '@mui/material/Link';
import { useReactFlow } from 'reactflow';

import useEdgeDataStore from '../../store/useEdgeDataStore';
import useNodeDataStore from '../../store/useNodeDataStore';
import useStore from '../../store/useStore';
import styles from './TopAppBar.module.css';

export default function Breadcrumbs() {
  const { setNodes, setEdges, fitView } = useReactFlow();

  const { id: displayedWorkflowId } = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const setDisplayedWorkflowInfo = useStore(
    (state) => state.setDisplayedWorkflowInfo,
  );
  const loadedGraphs = useStore((state) => state.loadedGraphs);
  function getGraphLabel(id: string) {
    return loadedGraphs.get(id)?.graph.label || id;
  }

  const displayedWorkflowParents = useStore(
    (state) => state.displayedWorkflowParents,
  );

  const setDataFromNodes = useNodeDataStore((state) => state.setDataFromNodes);
  const setDataFromEdges = useEdgeDataStore((state) => state.setDataFromEdges);

  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  if (!rootWorkflowId) {
    return (
      <>
        Untitled workflow <span className={styles.labelHint}>(unsaved)</span>
      </>
    );
  }

  function goToGraph(id: string) {
    const subgraph = loadedGraphs.get(id);
    if (!subgraph) {
      return;
    }
    setNodes(subgraph.nodes);
    setDataFromNodes(subgraph.nodes);
    setEdges(subgraph.links);
    setDataFromEdges(subgraph.links);
    setDisplayedWorkflowInfo(subgraph.graph);
    setTimeout(() => {
      fitView({ duration: 500 });
    }, 300);
  }

  return (
    <MuiBreadcrumbs
      className={styles.title}
      aria-label="breadcrumb"
      color="inherit"
    >
      {displayedWorkflowParents.map((graphId) => {
        return (
          <Link
            key={graphId}
            id={graphId}
            href="/"
            className={styles.crumb}
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              goToGraph(graphId);
            }}
          >
            {getGraphLabel(graphId)}
          </Link>
        );
      })}
      <span className={styles.crumb}>{getGraphLabel(displayedWorkflowId)}</span>
    </MuiBreadcrumbs>
  );
}
