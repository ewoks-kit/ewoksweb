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
import useSelectedElementStore from 'store/useSelectedElementStore';
import { useReactFlow } from 'reactflow';
// import { useSelectedElement } from '../../../store/graph-hooks';

interface Content {
  title: string;
  EditComponent: () => JSX.Element;
}

function getAccordionContent(element: EwoksRFElement): Content {
  if (isNode(element)) {
    return {
      title: 'Styling Node',
      EditComponent: () => <EditNodeStyle {...element} />,
    };
  }

  if (isLink(element)) {
    return {
      title: 'Styling Link',
      EditComponent: () => <EditLinkStyle {...element} />,
    };
  }

  return {
    title: 'Styling Graph',
    EditComponent: EditGraphStyle,
  };
}

// DOC: For editing the style of nodes and links
export default function EditElementStyle() {
  const { getNodes, getEdges } = useReactFlow();
  const graphRFDetails = useStore((state) => state.graphRFDetails);
  const selectedElementNew = useSelectedElementStore(
    (state) => state.selectedElementNew
  );
  // In a hook when the 2 stores stop setting each other
  const element =
    selectedElementNew.type === 'node'
      ? getNodes().find((node) => node.id === selectedElementNew.id)
      : selectedElementNew.type === 'edge'
      ? getEdges().find((edge) => edge.id === selectedElementNew.id)
      : graphRFDetails;

  const { title, EditComponent } = getAccordionContent(
    element as EwoksRFElement
  );

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
