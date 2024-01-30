import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useSearchParams } from 'react-router-dom';
import { useStoreApi } from 'reactflow';
import { useStore as useRFStore } from 'reactflow';

import ErrorFallback from '../general/ErrorFallback';
import useEdgeDataStore from '../store/useEdgeDataStore';
import useNodeDataStore from '../store/useNodeDataStore';
import displayedWorkflowInfo from '../store/useStore';
import useWorkflowInfoStore from '../store/useStore';
import type { workflowChange } from '../store/useWorkflowChangesStore';
import useWorkflowChanges from '../store/useWorkflowChangesStore';
import SuspenseBoundary from '../suspense/SuspenseBoundary';
import Canvas from './Canvas/Canvas';
import styles from './EditPage.module.css';
import EditSidebar from './Sidebar/EditSidebar';
import OverflowDrawer from './TaskDrawer/TaskDrawer';
import TopAppBar from './TopAppBar/TopAppBar';

export default function EditPage() {
  const [searchParams] = useSearchParams();

  const workflowId = searchParams.get('workflow');
  const setWorkflowChange = useWorkflowChanges(
    (state) => state.setWorkflowChange,
  );
  const { subscribe: subscribeRFStore } = useStoreApi();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveChange = useCallback(
    debounce((change: workflowChange) => {
      const { nodesData, edgesData, workflowInfo, rfNodesEdges } = change;

      setWorkflowChange({
        nodesData: nodesData || useNodeDataStore.getState().nodesData,
        edgesData: edgesData || useEdgeDataStore.getState().edgesData,
        workflowInfo:
          workflowInfo || useWorkflowInfoStore.getState().displayedWorkflowInfo,
        rfNodesEdges: rfNodesEdges || useRFStore.getState(),
      });
    }, 500),
    [setWorkflowChange],
  );

  useEffect(() => {
    const unsubs = [
      useNodeDataStore.subscribe(({ nodesData }) => saveChange({ nodesData })),
      useEdgeDataStore.subscribe(({ edgesData }) => saveChange({ edgesData })),

      displayedWorkflowInfo.subscribe((workflowDetails) =>
        saveChange({ workflowInfo: workflowDetails.displayedWorkflowInfo }),
      ),
      subscribeRFStore(({ edges, getNodes }) =>
        saveChange({ rfNodesEdges: { edges, nodes: getNodes() } }),
      ),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [saveChange, subscribeRFStore]);

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
