import EditElementStyle from './edit/EditElementStyle';
import EditSidebarMenu from './sidebarMenu/EditSidebarMenu';
import { isNodeRF } from '../../utils/typeGuards';
import ElementDetails from './details/ElementDetails';
import { useSelectedElement } from '../../store/graph-hooks';

import styles from './EditSidebar.module.css';

export default function EditSidebar() {
  const selected = useSelectedElement();

  return (
    <aside className={styles.container}>
      <div className={styles.titleBar}>
        <span className={styles.title}>
          {!selected ? 'Workflow' : isNodeRF(selected) ? 'Node' : 'Link'}
        </span>
        <EditSidebarMenu selectedElement={selected} />
      </div>
      <ElementDetails selectedElement={selected} />
      <EditElementStyle selectedElement={selected} />
    </aside>
  );
}
