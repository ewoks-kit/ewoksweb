import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useReactFlow } from 'reactflow';

import ErrorFallback from '../general/ErrorFallback';
import useSnackbarStore from '../store/useSnackbarStore';
import useWorkflowToRestore from '../store/useWorkflowToRestore';
import SuspenseBoundary from '../suspense/SuspenseBoundary';
import { textForError } from '../utils';
import Canvas from './Canvas/Canvas';
import styles from './EditPage.module.css';
import EditSidebar from './Sidebar/EditSidebar';
import OverflowDrawer from './TaskDrawer/TaskDrawer';
import TopAppBar from './TopAppBar/TopAppBar';

export default function EditPage() {
  const rfInstance = useReactFlow();
  const workflowToRestore = useWorkflowToRestore((state) => state.graph);

  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  if (workflowToRestore) {
    try {
      rfInstance.setNodes(workflowToRestore.nodes);
      rfInstance.setEdges(workflowToRestore.links);
    } catch (error) {
      showErrorMsg(
        textForError(
          error,
          'Error in retrieving workflow. Please check connectivity with the server!',
        ),
      );
    }
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
