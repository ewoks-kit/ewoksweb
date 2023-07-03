import Typography from '@material-ui/core/Typography';
import EditNodeStyle from './EditNodeStyle';
import EditLinkStyle from './EditLinkStyle';
import EditGraphStyle from './EditGraphStyle';
import type { Node, Edge } from 'reactflow';
import { isNodeRF } from '../../../utils/typeGuards';
import type { SelectedElementRF } from '../../../types';

interface Content {
  title: string;
  EditComponent: () => JSX.Element;
}

function getAccordionContent(
  selectedElement: Node | Edge | undefined
): Content {
  if (!selectedElement) {
    return {
      title: '',
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
  const { title, EditComponent } = getAccordionContent(selectedElement);

  return (
    <>
      <Typography style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{ padding: '5px 0px 0px' }}>{title}</span>
      </Typography>
      <form noValidate autoComplete="off">
        <EditComponent />
      </form>
    </>
  );
}
