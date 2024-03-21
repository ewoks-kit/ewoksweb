import { useSelectedElement } from '../../store/graph-hooks';
import { isEdgeRF, isNodeRF } from '../../utils/typeGuards';
import EditLinkSidebar from './EditLinkSidebar';
import EditNodeSidebar from './EditNodeSidebar';
import styles from './EditSidebar.module.css';
import EditWorkflowSidebar from './EditWorkflowSidebar';

export default function EditSidebar() {
  const selectedElement = useSelectedElement();

  return (
    <aside className={styles.container}>
      {!selectedElement ? (
        <EditWorkflowSidebar />
      ) : isNodeRF(selectedElement) ? (
        <EditNodeSidebar key={selectedElement.id} node={selectedElement} />
      ) : isEdgeRF(selectedElement) ? (
        <EditLinkSidebar key={selectedElement.id} link={selectedElement} />
      ) : null}
    </aside>
  );
}
