import EditElementStyle from './edit/EditElementStyle';
import IconMenu from './IconMenu';
import { isNodeRF } from '../../utils/typeGuards';
import useSelectedElementStore from '../../store/useSelectedElementStore';
import ElementDetails from './details/ElementDetails';
import { useSelectedElement } from '../../store/graph-hooks';

export default function EditSidebar() {
  const selected = useSelectedElement();

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
          {isNodeRF(selected)
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
