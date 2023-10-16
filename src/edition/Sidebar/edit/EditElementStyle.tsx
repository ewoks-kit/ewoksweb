import type { Edge, Node } from 'reactflow';

import type { SelectedElementRF } from '../../../types';
import { isNodeRF } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';
import EditGraphStyle from './EditGraphStyle';
import EditLinkStyle from './EditLinkStyle';
import EditNodeStyle from './EditNodeStyle';

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
      <h3 style={sidebarStyle.sectionHeader}>{title}</h3>
      <EditComponent />
    </>
  );
}
