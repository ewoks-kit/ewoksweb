import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import GraphDetails from './GraphDetails';
import { isEdgeRF, isNodeRF } from '../../../utils/typeGuards';
import type { SelectedElementRF } from '../../../types';

function ElementDetails({ selectedElement }: SelectedElementRF) {
  return (
    <form noValidate autoComplete="off" style={{ width: '100%' }}>
      {!selectedElement ? (
        <GraphDetails />
      ) : isNodeRF(selectedElement) &&
        selectedElement.type !== 'graphInput' &&
        selectedElement.type !== 'graphOutput' ? (
        <NodeDetails key={selectedElement.id} {...selectedElement} />
      ) : (
        isEdgeRF(selectedElement) && (
          <LinkDetails key={selectedElement.id} {...selectedElement} />
        )
      )}
    </form>
  );
}

export default ElementDetails;
