import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../api/tasks';
import { fetchWorkflow } from '../api/workflows';
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

  const workflowToRestoreId = useWorkflowToRestoreId((state) => state.id);
  const resetWorkflowToRestoreId = useWorkflowToRestoreId(
    (state) => state.resetId,
  );

  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  let workflowId;
  const [, setQueryParams] = useSearchParams();

  // const restoreWorkflow = async (workflow: string) => {
  //   try {
  //     const graph = await fetchWorkflow(workflow);
  //     setRootWorkflow(graph, rfInstance, tasks, 'fromServer');
  //   } catch (error) {
  //     showErrorMsg(
  //       textForError(
  //         error,
  //         'Error in retrieving workflow. Please check connectivity with the server!',
  //       ),
  //     );
  //   } finally {
  //     resetWorkflowToRestoreId();
  //   }
  // };

  console.log(workflowToRestoreId, queryParams);

  if (
    workflowToRestoreId &&
    queryParams.get('workflow') !== workflowToRestoreId
  ) {
    console.log('restore');

    setQueryParams({ workflow: workflowToRestoreId });
    // resetWorkflowToRestoreId();
    // restoreWorkflow(workflowToRestoreId);
  } else {
    workflowId = queryParams.get('workflow');
    console.log('not restore', workflowId, queryParams.get('workflow'));
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
                <Canvas key={workflowId} workflowId={workflowId || undefined} />
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
