import { useReactFlow } from '@xyflow/react';
import type { RefCallback } from 'react';
import { useCallback, useState } from 'react';

import { useNodesIds } from '../store/graph-hooks';
import useNodeDataStore from '../store/useNodeDataStore';
import type { RFNode } from '../types';
import { getNodeData } from '../utils';
import { assertDefined, assertNodeDataDefined } from '../utils/typeGuards';
import { generateNewNodeId } from './utils';

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

export function useCssColors(
  colorProperties: string[],
): [string[], RefCallback<HTMLElement>] {
  const [styles, setStyles] = useState<CSSStyleDeclaration>();

  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const refCallback: RefCallback<HTMLElement> = useCallback(
    (elem) => setStyles(elem ? window.getComputedStyle(elem) : undefined),
    [],
  );

  if (!styles) {
    // Return `transparent` colors on initial render
    return [colorProperties.map(() => 'transparent'), refCallback];
  }

  const colors = colorProperties.map((p) => styles.getPropertyValue(p).trim());

  return [colors, refCallback];
}
