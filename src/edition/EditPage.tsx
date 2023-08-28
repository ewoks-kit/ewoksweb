import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useReactFlow } from 'reactflow';
import { useTasks } from '../api/tasks';

import { fetchWorkflow } from '../api/workflows';
import ErrorFallback from '../general/ErrorFallback';
import useWorkflowToRestoreId from '../store/useWorkflowToRestoreId';
import useStore from '../store/useStore';
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

  const workflowToRestoreId = useWorkflowToRestoreId((state) => state.id);
  const resetWorkflowToRestoreId = useWorkflowToRestoreId(
    (state) => state.resetId
  );

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);

  if (workflowToRestoreId) {
    const restoreWorkflow = async () => {
      try {
        const { data: graph } = await fetchWorkflow(workflowToRestoreId);
        setRootWorkflow(graph, rfInstance, tasks, 'fromServer');
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(
            error,
            'Error in retrieving workflow. Please check connectivity with the server!'
          ),
          severity: 'error',
        });
      } finally {
        resetWorkflowToRestoreId();
      }
    };
    restoreWorkflow();
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
