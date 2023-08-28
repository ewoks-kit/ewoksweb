import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import Link from '@material-ui/core/Link';
import useStore from '../../store/useStore';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import useEdgeDataStore from '../../store/useEdgeDataStore';

import styles from './TopAppBar.module.css';

export default function SubgraphStack() {
  const { setNodes, setEdges, fitView } = useReactFlow();

  const rfWorkflows = useStore((state) => state.rfWorkflows);
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

    const subgraph = rfWorkflows.get(target.id);

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
                  ? styles.disabledCrumb
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
  );
}
