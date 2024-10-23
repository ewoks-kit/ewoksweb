import { isEdge, isNode } from '@xyflow/react';

import { useSelectedElement } from '../../store/graph-hooks';
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
      ) : isNode(selectedElement) ? (
        <EditNodeSidebar key={selectedElement.id} node={selectedElement} />
      ) : isEdge(selectedElement) ? (
        <EditLinkSidebar key={selectedElement.id} link={selectedElement} />
      ) : null}
    </aside>
  );
}
