import EditElementStyle from './edit/EditElementStyle';
import EditSidebarMenu from './sidebarMenu/EditSidebarMenu';
import { isNodeRF } from '../../utils/typeGuards';
import ElementDetails from './details/ElementDetails';
import { useSelectedElement } from '../../store/graph-hooks';

export default function EditSidebar() {
  const selected = useSelectedElement();

  return (
    <aside
      className="dndflow"
      key={
        !selected
          ? 'Workflow'
          : isNodeRF(selected)
          ? `Node ${selected.id}`
          : `Link ${selected.id}`
      }
    >
      <span style={{ display: 'block' }}>
        <span
          style={{
            fontSize: 30,
            color: '#3f51b5',
          }}
        >
          {!selected ? 'Workflow' : isNodeRF(selected) ? 'Node' : 'Link'}
        </span>
        <span style={{ float: 'right' }}>
          <EditSidebarMenu selectedElement={selected} />
        </span>
      </span>
      <ElementDetails selectedElement={selected} />
      <EditElementStyle selectedElement={selected} />
    </aside>
  );
}
