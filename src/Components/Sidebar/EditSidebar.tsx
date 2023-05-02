import EditElementStyle from './edit/EditElementStyle';
import IconMenu from './IconMenu';
import { isNodeRF } from '../../utils/typeGuards';
import ElementDetails from './details/ElementDetails';
import { useSelectedElement } from '../../store/graph-hooks';

export default function EditSidebar() {
  const selected = useSelectedElement();

  return (
    <aside className="dndflow">
      {/* Inline style till sidebar is refactored */}
      <span style={{ display: 'block' }}>
        <span
          style={{
            fontSize: 30,
            color: '#3f51b5',
          }}
        >
          {!selected ? 'Workflow' : isNodeRF(selected) ? 'Node' : 'Edge'}
        </span>
        <span style={{ float: 'right' }}>
          <IconMenu selectedElement={selected} />
        </span>
      </span>
      <ElementDetails selectedElement={selected} />
      <EditElementStyle selectedElement={selected} />
    </aside>
  );
}
