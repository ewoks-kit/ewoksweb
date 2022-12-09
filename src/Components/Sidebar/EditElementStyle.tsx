import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../../types';
import EditNodeStyle from './EditNodeStyle';
import EditLinkStyle from './EditLinkStyle';
import EditGraphStyle from './EditGraphStyle';
import useStore from '../../store/useStore';

interface Content {
  title: string;
  EditComponent: () => JSX.Element;
}

function getAccordionContent(
  element: EwoksRFNode | EwoksRFLink | GraphDetails
): Content | undefined {
  if ('position' in element) {
    return {
      title: 'Styling Node',
      EditComponent: () => <EditNodeStyle element={element} />,
    };
  }

  if ('source' in element) {
    return {
      title: 'Styling Link',
      EditComponent: () => <EditLinkStyle element={element} />,
    };
  }

  if ('input_nodes' in element) {
    return {
      title: 'Styling Graph',
      EditComponent: () => <EditGraphStyle />,
    };
  }

  return undefined;
}

// DOC: For editing the style of nodes and links
export default function EditElementStyle() {
  const selectedElement = useStore((state) => state.selectedElement);

  const content = getAccordionContent(selectedElement);

  if (!content) {
    return null;
  }

  const { title, EditComponent } = content;

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
