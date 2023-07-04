import EditNodeStyle from './EditNodeStyle';
import EditLinkStyle from './EditLinkStyle';
import EditGraphStyle from './EditGraphStyle';
import type { Node, Edge } from 'reactflow';
import { isNodeRF } from '../../../utils/typeGuards';
import type { SelectedElementRF } from '../../../types';

import SidebarSection from '../SidebarSection';

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
      title: 'Styling Node',
      EditComponent: () => <EditNodeStyle nodeId={selectedElement.id} />,
    };
  }

  return {
    title: 'Styling Link',
    EditComponent: () => <EditLinkStyle {...selectedElement} />,
  };
}

// DOC: For editing the style of nodes and links
export default function EditElementStyle({
  selectedElement,
}: SelectedElementRF) {
  const { title, EditComponent } = getSectionContent(selectedElement);

  return (
    <SidebarSection title={title}>
      <form noValidate autoComplete="off">
        <EditComponent />
      </form>
    </SidebarSection>
  );
}
