import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import GraphDetails from './GraphDetails';
import { isNodeRF } from '../../../utils/typeGuards';
import type { SelectedElementRF } from '../../../types';

function ElementDetails({ selectedElement }: SelectedElementRF) {
  return (
    <form noValidate autoComplete="off" style={{ width: '100%' }}>
      {isNodeRF(selectedElement) ? (
        <NodeDetails {...selectedElement} />
      ) : selectedElement ? (
        <LinkDetails {...selectedElement} />
      ) : (
        <GraphDetails />
      )}
    </form>
  );
}

export default ElementDetails;
