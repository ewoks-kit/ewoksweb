import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

import EditNodeStyle from './EditNodeStyle';
import EditLinkStyle from './EditLinkStyle';
import EditGraphStyle from './EditGraphStyle';
import type { SelectedElement } from '../../../types';
import useSelectedElementStore from '../../../store/useSelectedElementStore';

interface Content {
  title: string;
  EditComponent: () => JSX.Element;
}

function getAccordionContent(element: SelectedElement): Content {
  if (element.type === 'node') {
    return {
      title: 'Styling Node',
      EditComponent: () => <EditNodeStyle nodeId={element.id} />,
    };
  }

  if (element.type === 'edge') {
    return {
      title: 'Styling Link',
      EditComponent: () => <EditLinkStyle />,
    };
  }

  return {
    title: 'Styling Graph',
    EditComponent: EditGraphStyle,
  };
}

// DOC: For editing the style of nodes and links
export default function EditElementStyle() {
  // element: EwoksRFNode | EwoksRFLink | GraphDetails
  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );
  const { title, EditComponent } = getAccordionContent(selectedElement);

  return (
    <Accordion className="Accordions-sidebar">
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
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
