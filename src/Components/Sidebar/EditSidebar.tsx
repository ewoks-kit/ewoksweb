import EditElementStyle from './edit/EditElementStyle';
import IconMenu from './IconMenu';
import { isNodeRF } from '../../utils/typeGuards';
import type { ReactFlowState } from 'reactflow';
import useSelectedElementStore from '../../store/useSelectedElementStore';
import ElementDetails from './details/ElementDetails';
import { useStore as useRFStore } from 'reactflow';

const nodeEdgeSelectedSelector = (state: ReactFlowState) => {
  const nodeSelected = [...state.nodeInternals.values()].find(
    (node) => node.selected
  );
  if (nodeSelected) {
    return nodeSelected;
  }
  const edgeSelected = [...state.edges.values()].find((edge) => edge.selected);
  if (edgeSelected) {
    return edgeSelected;
  }
  return undefined;
};

export default function EditSidebar() {
  const selected = useRFStore(nodeEdgeSelectedSelector);

  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );

  return (
    <aside className="dndflow">
      {/* Inline style till sidebar is refactored */}
      <span style={{ display: 'block' }}>
        <span
          style={{
            fontSize: 30,
            color: 'blue',
          }}
        >
          {isNodeRF(selected) // selectedElement.type === 'node'
            ? 'Node'
            : selectedElement.type === 'edge'
            ? 'Edge'
            : 'Workflow'}
        </span>
        <span style={{ float: 'right' }}>
          <IconMenu />
        </span>
      </span>
      <ElementDetails />
      <EditElementStyle />
    </aside>
  );
}
