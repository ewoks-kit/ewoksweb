import { useEventListener } from '@react-hookz/web';
import { unstable_usePrompt } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import { useNodesIds } from '../store/graph-hooks';
import useNodeDataStore from '../store/useNodeDataStore';
import type { RFNode } from '../types';
import { getNodeData } from '../utils';
import { assertDefined, assertNodeDataDefined } from '../utils/typeGuards';
import { generateNewNodeId } from './utils';

export function useWarningPrompt(displayWarning: boolean) {
  useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
    if (displayWarning) {
      event.preventDefault();

      // Included for legacy support, e.g. Chrome/Edge < 119
      event.returnValue = true;
    }
  });

  unstable_usePrompt({
    message: 'There are unsaved changes. Continue without saving?',
    when: displayWarning,
  });
}

export function useCloneNode() {
  const rfInstance = useReactFlow();
  const nodesIds = useNodesIds();
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  return (id: string) => {
    const nodeData = getNodeData(id);
    assertNodeDataDefined(nodeData, id);
    const { task_props } = nodeData;
    const nodeToClone = rfInstance.getNode(id);
    assertDefined(nodeToClone);

    const clone: RFNode = {
      ...nodeToClone,
      id: generateNewNodeId(task_props, nodesIds),
      position: {
        x: nodeToClone.position.x + 100,
        y: nodeToClone.position.y + 100,
      },
      data: {},
    };

    rfInstance.addNodes(clone);
    setNodeData(clone.id, nodeData);
  };
}
