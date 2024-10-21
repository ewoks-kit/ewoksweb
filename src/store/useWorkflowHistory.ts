import type { Edge, Node } from '@xyflow/react';
import isEqual from 'lodash/isEqual';
import { create } from 'zustand';

import type { GraphDetails, Workflow } from '../types';
import { toEwoksWorkflow } from '../utils';
import type { EdgeDataState } from './useEdgeDataStore';
import type { NodeDataState } from './useNodeDataStore';

interface State {
  workflowHistory: Workflow[];
  resetWorkflowHistory: () => void;
  pushToWorkflowHistory: (
    nodesData: NodeDataState['nodesData'],
    edgesData: EdgeDataState['edgesData'],
    workflowInfo: GraphDetails,
    rfNodes: Node[],
    rfEdges: Edge[],
  ) => void;
}

const useWorkflowHistory = create<State>((set, get) => ({
  workflowHistory: [],
  resetWorkflowHistory: () => {
    set({
      workflowHistory: [],
    });
  },
  pushToWorkflowHistory: (
    nodesData,
    edgesData,
    workflowInfo,
    rfNodes,
    rfEdges,
  ) => {
    const changedWorkflow = toEwoksWorkflow(
      workflowInfo,
      rfNodes,
      rfEdges,
      nodesData,
      edgesData,
    );

    const { workflowHistory } = get();

    const isNewWorkflow =
      changedWorkflow.graph.id !== workflowHistory[0]?.graph.id;

    if (isNewWorkflow) {
      set({
        workflowHistory: [changedWorkflow],
      });
      return;
    }

    if (isEqual(workflowHistory[workflowHistory.length - 1], changedWorkflow)) {
      return;
    }

    set({
      workflowHistory: [...workflowHistory, changedWorkflow],
    });
  },
}));

export default useWorkflowHistory;
