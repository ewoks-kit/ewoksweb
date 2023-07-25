import React, { useState, useEffect } from 'react';
import EditSidebar from './Sidebar/EditSidebar';
import Canvas from './Canvas/Canvas';
import SimpleSnackbar from '../general/Snackbar';
import useStore from 'store/useStore';
import ConfirmDialog from '../general/ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../general/ErrorFallback';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { fetchWorkflow } from '../api/workflows';
import { useReactFlow } from 'reactflow';
import OverflowDrawer from './TaskDrawer/TaskDrawer';
import useTaskDrawerState from '../store/taskDrawerState';
import { useGetTasks } from '../general/hooks';
import TopAppBar from './TopAppBar/TopAppBar';

import styles from './EditPage.module.css';
import useCurrentWorkflowIdStore from '../store/useCurrentWorkflowId';
import { textForError } from '../utils';

export default function EditPage() {
  const rfInstance = useReactFlow();

  const canvasGraphChanged = useStore((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const tasks = useStore((state) => state.tasks);
  const setTaskDrawerOpen = useTaskDrawerState((state) => state.setOpen);

  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const undoIndex = useStore((state) => state.undoIndex);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const initGraph = useStore((state) => state.initGraph);

  const currentWorkflowId = useCurrentWorkflowIdStore((state) => state.id);

  useEffect(() => {
    if (currentWorkflowId) {
      const loadGraph = async () => {
        try {
          const { data: graph } = await fetchWorkflow(currentWorkflowId);
          initGraph(graph, 'fromServer', rfInstance);
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
    } else {
      initGraph(initializedGraph, undefined, rfInstance);
    }
  }, [
    initializedGraph,
    setOpenSnackbar,
    initGraph,
    rfInstance,
    currentWorkflowId,
  ]);

  const getTasks = useGetTasks();
  useEffect(() => {
    if (tasks.length === 0) {
      getTasks();
    }
  });

  function checkAndNewGraph(notSave: boolean) {
    if (canvasGraphChanged && undoIndex !== 0 && !notSave) {
      setOpenAgreeDialog(true);
    } else {
      initGraph(initializedGraph, undefined, rfInstance);
      setOpenAgreeDialog(false);
      setCanvasGraphChanged(false);
      setTaskDrawerOpen(true);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLImageElement>) {
    const controlKey = event.ctrlKey || event.metaKey;
    if (!controlKey) {
      return;
    }

    const charCode = String.fromCodePoint(event.which).toLowerCase();
    // Comment until undo-redo is back
    // if (charCode === 'z') {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   undo();
    //   return;
    // }
    // if (charCode === 'y') {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   redo();
    //   return;
    // }
    if (event.shiftKey && charCode === 'n') {
      event.preventDefault();
      event.stopPropagation();
      checkAndNewGraph(false);
    }
  }

  const disAgreeSaveWithout = () => {
    setOpenAgreeDialog(false);
  };

  return (
    <div
      className={styles.root}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={() => checkAndNewGraph(true)}
        disagreeCallback={disAgreeSaveWithout}
      />
      <SimpleSnackbar />
      <TopAppBar checkAndNewGraph={checkAndNewGraph} />
      <div className={styles.mainArea}>
        <OverflowDrawer />
        <ReflexContainer
          orientation="vertical"
          className={styles.reflexContainer}
        >
          <ReflexElement>
            <main className={styles.content}>
              <ErrorBoundary
                FallbackComponent={(fallbackProps) => (
                  <ErrorFallback {...fallbackProps} />
                )}
              >
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
