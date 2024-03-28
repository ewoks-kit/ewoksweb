import { useDebouncedCallback } from '@react-hookz/web';
import { useEffect } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useSearchParams } from 'react-router-dom';
import { useStoreApi } from 'reactflow';

import ErrorFallback from '../general/ErrorFallback';
import { useWorkflowHasChanges } from '../store/graph-hooks';
import useEdgeDataStore from '../store/useEdgeDataStore';
import useNodeDataStore from '../store/useNodeDataStore';
import displayedWorkflowInfo from '../store/useStore';
import useWorkflowInfoStore from '../store/useStore';
import useWorkflowHistory from '../store/useWorkflowHistory';
import SuspenseBoundary from '../suspense/SuspenseBoundary';
import Canvas from './Canvas/Canvas';
import styles from './EditPage.module.css';
import { useWarningPrompt } from './hooks';
import EditSidebar from './Sidebar/EditSidebar';
import OverflowDrawer from './TaskDrawer/TaskDrawer';
import TopAppBar from './TopAppBar/TopAppBar';

export default function EditPage() {
  const [searchParams] = useSearchParams();
  const workflowHasChanges = useWorkflowHasChanges();

  useWarningPrompt(workflowHasChanges);

  const workflowId = searchParams.get('workflow');
  const pushToWorkflowHistory = useWorkflowHistory(
    (state) => state.pushToWorkflowHistory,
  );
  const { subscribe: subscribeRFStore } = useStoreApi();
  const storeRF = useStoreApi();
  const handleWorkflowChange = useDebouncedCallback(
    () => {
      pushToWorkflowHistory(
        useNodeDataStore.getState().nodesData,
        useEdgeDataStore.getState().edgesData,
        useWorkflowInfoStore.getState().displayedWorkflowInfo,
        storeRF.getState().getNodes(),
        storeRF.getState().edges,
      );
    },
    [pushToWorkflowHistory, storeRF],
    500,
  );

  useEffect(() => {
    const unsubs = [
      useNodeDataStore.subscribe(handleWorkflowChange),
      useEdgeDataStore.subscribe(handleWorkflowChange),

      displayedWorkflowInfo.subscribe(handleWorkflowChange),
      subscribeRFStore(handleWorkflowChange),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [handleWorkflowChange, subscribeRFStore]);

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
