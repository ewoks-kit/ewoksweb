import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  if (isNodeRF(selectedElement)) {
    return {
      title: 'Styling Node',
      EditComponent: () => <EditNodeStyle nodeId={selectedElement.id} />,
    };
  }

  if (selectedElement) {
    return {
      title: 'Styling Link',
      EditComponent: () => <EditLinkStyle {...selectedElement} />,
    };
  }

  return {
    title: 'Styling Graph',
    EditComponent: EditGraphStyle,
  };
}

// DOC: For editing the style of nodes and links
export default function EditElementStyle({
  selectedElement,
}: SelectedElementRF) {
  const { title, EditComponent } = getAccordionContent(selectedElement);

  return (
    <Accordion className="Accordions-sidebar">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form noValidate autoComplete="off">
          <EditComponent />
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
