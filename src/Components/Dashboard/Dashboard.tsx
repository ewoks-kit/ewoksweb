import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import EditSidebar from 'Components/Sidebar/EditSidebar';
import Canvas from '../Canvas/Canvas';
import SimpleSnackbar from '../General/Snackbar';
import { useDashboardStyles } from './useDashboardStyles';
import useStore from 'store/useStore';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../General/ErrorFallback';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { getWorkflow } from '../../api/api';
import { useReactFlow } from 'reactflow';
import OverflowDrawer from '../TaskDrawer/TaskDrawer';
import addNodesSidebarState from '../../store/addNodesSidebarState';
import { useGetTasks } from '../TopNavBar/hooks';
import TopAppBar from './TopAppBar';

const initialWorkflowId = process.env.REACT_APP_INITIAL_WORKFLOW_ID;

export default function Dashboard() {
  const classes = useDashboardStyles();

  const rfInstance = useReactFlow();

  const canvasGraphChanged = useStore((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const tasks = useStore((state) => state.tasks);
  const toggleAddNodesSidebar = addNodesSidebarState(
    (state) => state.toggleAddNodesSidebar
  );

  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const undoIndex = useStore((state) => state.undoIndex);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const initGraph = useStore((state) => state.initGraph);

  useEffect(() => {
    if (initialWorkflowId) {
      const loadGraph = async () => {
        const { data: graph } = await getWorkflow(initialWorkflowId);
        initGraph(graph, 'fromServer', rfInstance);
      };
      loadGraph();
    }
  }, [initGraph, rfInstance]);

  useEffect(() => {
    initGraph(initializedGraph, undefined, rfInstance);
    // Only run once on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      toggleAddNodesSidebar(true);
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
      className={classes.root}
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
      <CssBaseline />
      <SimpleSnackbar />
      <TopAppBar classes={classes} checkAndNewGraph={checkAndNewGraph} />
      <div className={classes.mainArea}>
        <OverflowDrawer />
        <ReflexContainer
          orientation="vertical"
          className={classes.reflexContainer}
        >
          <ReflexElement>
            <main className={classes.content}>
              <ErrorBoundary
                FallbackComponent={(fallbackProps) => (
                  <ErrorFallback {...fallbackProps} />
                )}
              >
                <Canvas />
              </ErrorBoundary>
            </main>
          </ReflexElement>
          <ReflexSplitter propagate className={classes.reflexSplitter} />
          <ReflexElement minSize={100} maxSize={500} size={350}>
            <EditSidebar />
          </ReflexElement>
        </ReflexContainer>
      </div>
    </div>
  );
}
