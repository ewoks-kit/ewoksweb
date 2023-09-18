import EditNodeStyle from './EditNodeStyle';
import EditLinkStyle from './EditLinkStyle';
import EditGraphStyle from './EditGraphStyle';
import type { Node, Edge } from 'reactflow';
import { isNodeRF } from '../../../utils/typeGuards';
import type { SelectedElementRF } from '../../../types';

interface Content {
  title?: string;
  EditComponent: () => JSX.Element;
}

function getSectionContent(selectedElement: Node | Edge | undefined): Content {
  if (!selectedElement) {
    return {
      EditComponent: EditGraphStyle,
    };
  }

  if (isNodeRF(selectedElement)) {
    return {
      title: 'Appearance',
      EditComponent: () => <EditNodeStyle nodeId={selectedElement.id} />,
    };
  }

  return {
    title: 'Appearance',
    EditComponent: () => <EditLinkStyle {...selectedElement} />,
  };
}

// DOC: For editing the style of nodes and links
export default function EditElementStyle({
  selectedElement,
}: SelectedElementRF) {
  const { title, EditComponent } = getSectionContent(selectedElement);

  return (
    <>
      <div style={{ marginTop: '15px', fontSize: '16px' }}>
        <b>{title}</b>
      </div>
      <EditComponent />
    </>
  );
}
