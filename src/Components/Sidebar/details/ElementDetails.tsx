import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import GraphDetails from './GraphDetails';
import useSelectedElementStore from '../../../store/useSelectedElementStore';

function ElementDetails() {
  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );

  return (
    <form noValidate autoComplete="off" style={{ width: '100%' }}>
      {selectedElement.type === 'node' ? (
        <NodeDetails />
      ) : selectedElement.type === 'edge' ? (
        <LinkDetails />
      ) : (
        <GraphDetails />
      )}
    </form>
  );
}

export default ElementDetails;
