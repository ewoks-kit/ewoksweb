import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import GraphDetails from './GraphDetails';
import { isNodeRF } from '../../../utils/typeGuards';
import type { SelectedElementRF } from '../../../types';

function ElementDetails({ selectedElement }: SelectedElementRF) {
  return (
    <form noValidate autoComplete="off" style={{ width: '100%' }}>
      {!selectedElement ? (
        <GraphDetails />
      ) : isNodeRF(selectedElement) ? (
        <NodeDetails {...selectedElement} />
      ) : (
        <LinkDetails {...selectedElement} />
      )}
    </form>
  );
}

export default ElementDetails;
