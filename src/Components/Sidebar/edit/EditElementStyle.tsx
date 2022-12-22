import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

import EditNodeStyle from './EditNodeStyle';
import EditLinkStyle from './EditLinkStyle';
import EditGraphStyle from './EditGraphStyle';
import useStore from '../../../store/useStore';
import { isNode, isLink } from 'utils/typeGuards';
import type { EwoksRFElement } from '../models';

interface Content {
  title: string;
  EditComponent: (element: EwoksRFElement) => JSX.Element;
}

function getAccordionContent(element: EwoksRFElement): Content {
  if (isNode(element)) {
    return {
      title: 'Styling Node',
      EditComponent: EditNodeStyle,
    };
  }

  if (isLink(element)) {
    return {
      title: 'Styling Link',
      EditComponent: EditLinkStyle,
    };
  }

  return {
    title: 'Styling Graph',
    EditComponent: EditGraphStyle,
  };
}

// DOC: For editing the style of nodes and links
export default function EditElementStyle() {
  const selectedElement = useStore((state) => state.selectedElement);

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
          <EditComponent {...selectedElement} />
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
