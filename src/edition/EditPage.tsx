import { useDebouncedCallback } from '@react-hookz/web';
import { useStoreApi } from '@xyflow/react';
import { useEffect } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { useSearchParams } from 'wouter';

import ErrorFallback from '../general/ErrorFallback';
import { useWorkflowHasChanges } from '../store/graph-hooks';
import useEdgeDataStore from '../store/useEdgeDataStore';
import useNodeDataStore from '../store/useNodeDataStore';
import useWorkflowHistory from '../store/useWorkflowHistory';
import useWorkflowStore from '../store/useWorkflowStore';
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
        useWorkflowStore.getState().workflowInfo,
        storeRF.getState().nodes,
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

      useWorkflowStore.subscribe(handleWorkflowChange),
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
        <Group>
          <Panel>
            <main className={styles.content}>
              <SuspenseBoundary FallbackComponent={ErrorFallback}>
                <Canvas key={workflowId} workflowId={workflowId || undefined} />
              </SuspenseBoundary>
            </main>
          </Panel>
          <Separator />
          <Panel minSize={100} maxSize={500} defaultSize={350}>
            <EditSidebar />
          </Panel>
        </Group>
      </div>
    </div>
  );
}
