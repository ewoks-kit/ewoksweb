import type { SelectedElementRF } from '../../../types';
import { isEdgeRF, isNodeRF } from '../../../utils/typeGuards';
import GraphDetails from './GraphDetails';
import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';

function ElementDetails({ selectedElement }: SelectedElementRF) {
  return (
    <form noValidate autoComplete="off" style={{ width: '100%' }}>
      {!selectedElement ? (
        <GraphDetails />
      ) : isNodeRF(selectedElement) ? (
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
