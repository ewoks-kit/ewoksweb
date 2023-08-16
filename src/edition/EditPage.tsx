import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useReactFlow } from 'reactflow';

import { fetchWorkflow } from '../api/workflows';
import ErrorFallback from '../general/ErrorFallback';
import { useGetTasks } from '../general/hooks';
import useCurrentWorkflowIdStore from '../store/useCurrentWorkflowId';
import useStore from '../store/useStore';
import { textForError } from '../utils';
import { EMPTY_GRAPH } from '../utils/emptyGraphs';
import Canvas from './Canvas/Canvas';
import styles from './EditPage.module.css';
import EditSidebar from './Sidebar/EditSidebar';
import OverflowDrawer from './TaskDrawer/TaskDrawer';
import TopAppBar from './TopAppBar/TopAppBar';

export default function EditPage() {
  const rfInstance = useReactFlow();

  const tasks = useStore((state) => state.tasks);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const workingGraphSource = useStore((state) => state.workingGraphSource);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);

  const currentWorkflowId = useCurrentWorkflowIdStore((state) => state.id);

  useEffect(() => {
    if (!currentWorkflowId && workingGraphSource !== 'fromDisk') {
      setWorkingGraph(EMPTY_GRAPH, rfInstance.setNodes, rfInstance.setEdges);
      return;
    }

    if (currentWorkflowId) {
      const loadGraph = async () => {
        try {
          const { data: graph } = await fetchWorkflow(currentWorkflowId);
          setWorkingGraph(
            graph,
            rfInstance.setNodes,
            rfInstance.setEdges,
            'fromServer'
          );
        } catch (error) {
          setOpenSnackbar({
            open: true,
            text: textForError(
              error,
              'Error in retrieving workflow. Please check connectivity with the server!'
            ),
            severity: 'error',
          });
        }
      };
      loadGraph();
    }
  }, [
    setOpenSnackbar,
    setWorkingGraph,
    rfInstance.setNodes,
    rfInstance.setEdges,
    currentWorkflowId,
    workingGraphSource,
  ]);

  const getTasks = useGetTasks();
  useEffect(() => {
    if (tasks.length === 0) {
      getTasks();
    }
  });

  return (
    <div className={styles.root}>
      <TopAppBar />
      <div className={styles.mainArea}>
        <OverflowDrawer />
        <ReflexContainer
          orientation="vertical"
          className={styles.reflexContainer}
        >
          <ReflexElement>
            <main className={styles.content}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Canvas />
              </ErrorBoundary>
            </main>
          </ReflexElement>
          <ReflexSplitter propagate className={styles.reflexSplitter} />
          <ReflexElement minSize={100} maxSize={500} size={350}>
            <EditSidebar />
          </ReflexElement>
        </ReflexContainer>
      </div>
    </div>
  );
}
