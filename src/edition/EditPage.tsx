import { debounce } from 'lodash';
import { useEffect } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useReactFlow, useStoreApi } from 'reactflow';

import { useTasks } from '../api/tasks';
import { fetchWorkflow } from '../api/workflows';
import ErrorFallback from '../general/ErrorFallback';
import useEdgeDataStore from '../store/useEdgeDataStore';
import useNodeDataStore from '../store/useNodeDataStore';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
import useWorkflowChanges from '../store/useWorkflowChangesStore';
import useWorkflowToRestoreId from '../store/useWorkflowToRestoreId';
import SuspenseBoundary from '../suspense/SuspenseBoundary';
import { textForError } from '../utils';
import Canvas from './Canvas/Canvas';
import styles from './EditPage.module.css';
import EditSidebar from './Sidebar/EditSidebar';
import OverflowDrawer from './TaskDrawer/TaskDrawer';
import TopAppBar from './TopAppBar/TopAppBar';

export default function EditPage() {
  const rfInstance = useReactFlow();
  const tasks = useTasks();
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();

  const workflowToRestoreId = useWorkflowToRestoreId((state) => state.id);
  const resetWorkflowToRestoreId = useWorkflowToRestoreId(
    (state) => state.resetId,
  );

  const setWorkflowChange = useWorkflowChanges(
    (state) => state.setWorkflowChange,
  );
  const { subscribe: subscribeRFStore } = useStoreApi();
  const subscribeWorkflowInfoStore = useStore.subscribe;

  const subscribeNodeDataStore = useNodeDataStore.subscribe;
  const subscribeEdgeDataStore = useEdgeDataStore.subscribe;

  useEffect(() => {
    const debouncedRFLog = debounce((s, p) => {
      console.log('RF');
      setWorkflowChange({
        rfNodesEdges: { nodes: s.nodeInternals, edges: s.edges },
      });
    }, 500);

    const debouncedWorkflowInfoLog = debounce((s, p) => {
      console.log('Info');
      setWorkflowChange({
        workflowInfo: s.displayedWorkflowInfo,
      });
    }, 500);

    const debouncedNodeDataLog = debounce((s, p) => {
      console.log('Nodes');
      setWorkflowChange({
        nodesData: s.nodesData,
      });
    }, 500);

    const debouncedEdgeDataLog = debounce((s, p) => {
      console.log('Edges');
      setWorkflowChange({
        edgesData: s.edgesData,
      });
    }, 500);

    subscribeRFStore((s, p) => debouncedRFLog(s, p));

    subscribeNodeDataStore((s, p) => debouncedNodeDataLog(s, p));

    subscribeEdgeDataStore((s, p) => debouncedEdgeDataLog(s, p));

    subscribeWorkflowInfoStore((s, p) => debouncedWorkflowInfoLog(s, p));
  }, [
    subscribeRFStore,
    subscribeNodeDataStore,
    subscribeEdgeDataStore,
    subscribeWorkflowInfoStore,
    setWorkflowChange,
  ]);

  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const workflowId = queryParams.get('workflow');

  const restoreWorkflow = async (workflow: string) => {
    try {
      const { data: graph } = await fetchWorkflow(workflow);
      setRootWorkflow(graph, rfInstance, tasks, 'fromServer');
    } catch (error) {
      showErrorMsg(
        textForError(
          error,
          'Error in retrieving workflow. Please check connectivity with the server!',
        ),
      );
    } finally {
      resetWorkflowToRestoreId();
    }
  };

  if (workflowToRestoreId) {
    restoreWorkflow(workflowToRestoreId);
  }

  if (workflowId) {
    restoreWorkflow(workflowId);
    navigate(window.location.pathname, { replace: true });
  }

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
              <SuspenseBoundary FallbackComponent={ErrorFallback}>
                <Canvas />
              </SuspenseBoundary>
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
