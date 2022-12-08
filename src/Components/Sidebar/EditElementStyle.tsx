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

// DOC: For eiting the style of nodes and links
export default function EditElementStyle() {
  const selectedElement = useStore<EwoksRFNode | EwoksRFLink | GraphDetails>(
    (state) => state.selectedElement
  );

  return (
    <Accordion className="Accordions-sidebar">
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
        aria-controls="panel1a-content"
      >
        <Typography>
          {'position' in selectedElement
            ? 'Styling Node'
            : 'source' in selectedElement
            ? 'Styling Link'
            : 'Styling Graph'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form noValidate autoComplete="off">
          {'position' in selectedElement && (
            <EditNodeStyle element={selectedElement} />
          )}
          {'source' in selectedElement && (
            <EditLinkStyle element={selectedElement} />
          )}
          {'input_nodes' in selectedElement && <EditGraphStyle />}
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
