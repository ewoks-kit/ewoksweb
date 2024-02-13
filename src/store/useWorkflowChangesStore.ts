import isEqual from 'lodash/isEqual';
import type { Edge, Node } from 'reactflow';
import { create } from 'zustand';

import type { GraphDetails, Workflow } from '../types';
import { prepareEwoksGraph } from '../utils';
import type { EdgeDataState } from './useEdgeDataStore';
import type { NodeDataState } from './useNodeDataStore';

interface State {
  workflowChanges: (Workflow | undefined)[];
  resetWorkflowChange: () => void;
  setWorkflowChange: (change: WorkflowChange) => void;
}

export interface WorkflowChange {
  nodesData: NodeDataState['nodesData'];
  edgesData: EdgeDataState['edgesData'];
  workflowInfo: GraphDetails;
  rfNodes: Node[];
  rfEdges: Edge[];
}

const useWorkflowChanges = create<State>((set, get) => ({
  workflowChanges: [],
  resetWorkflowChange: () => {
    const { workflowChanges } = get();
    const lastWorkflowChange = workflowChanges.slice(-1);
    set({
      workflowChanges: lastWorkflowChange,
    });
  },
  setWorkflowChange: (change: WorkflowChange) => {
    const { nodesData, edgesData, workflowInfo, rfNodes, rfEdges } = change;

    const ewoksWorkflow = prepareEwoksGraph(
      workflowInfo,
      rfNodes,
      rfEdges,
      nodesData,
      edgesData,
    );

    const { workflowChanges } = get();

    const isNewWorkflow =
      change.workflowInfo.id !== workflowChanges[0]?.graph.id;

    if (isNewWorkflow) {
      set({
        workflowChanges: [ewoksWorkflow],
      });
      return;
    }

    const isChanged = !isEqual(
      workflowChanges[workflowChanges.length - 1],
      ewoksWorkflow,
    );

    if (isChanged) {
      set({
        workflowChanges: [...workflowChanges, ewoksWorkflow],
      });
    }
  },
}));

export default useWorkflowChanges;
