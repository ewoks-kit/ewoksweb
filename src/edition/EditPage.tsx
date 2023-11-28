import { useState } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../api/tasks';
import { fetchWorkflow } from '../api/workflows';
import { useWorkflowDLE } from '../api/workflows';
import ErrorFallback from '../general/ErrorFallback';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
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
  const [workflowIdparam, setWorkflowIdparam] = useState<string>('');

  const { refetch } = useWorkflowDLE(workflowIdparam);

  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const workflowId = queryParams.get('workflow');

  const restoreWorkflow = async (workflow: string) => {
    try {
      const { data: graph } = await refetch();
      console.log(graph);

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
    setWorkflowIdparam(workflowToRestoreId);
    restoreWorkflow(workflowToRestoreId);
  }

  if (workflowId) {
    setWorkflowIdparam(workflowId);
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
