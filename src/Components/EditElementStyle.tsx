import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import useStore from '../store';
import type { EwoksRFLink, EwoksRFNode } from '../types';
import EditNodeStyle from './EditNodeStyle';
import EditLinkStyle from './EditLinkStyle';

export default function EditElementStyle(propsIn) {
  const { props } = propsIn;

  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          Styling{' '}
          {'position' in selectedElement
            ? 'Node'
            : 'source' in selectedElement
            ? 'Link'
            : 'Graph'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form noValidate autoComplete="off">
          {'position' in selectedElement && <EditNodeStyle props={props} />}
          {'source' in selectedElement && <EditLinkStyle props={props} />}
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
