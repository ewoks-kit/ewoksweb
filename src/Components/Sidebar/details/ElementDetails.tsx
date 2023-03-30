import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import GraphDetails from './GraphDetails';
import { useEffect, useState } from 'react';
import useSelectedElementStore from '../../../store/useSelectedElementStore';
import type { SelectedElement } from '../../../types';

interface Content {
  title: string;
  DetailsComponent: () => JSX.Element;
}

function getAccordionContent(element: SelectedElement): Content {
  if (element.type === 'node') {
    return {
      title: 'Node Details',
      DetailsComponent: () => <NodeDetails />,
    };
  }

  if (element.type === 'edge') {
    return {
      title: 'Link Details',
      DetailsComponent: () => <LinkDetails />,
    };
  }

  return {
    title: 'Graph Details',
    DetailsComponent: () => <GraphDetails />,
  };
}

// DOC: Container for link-node-graph editing details
function ElementDetails() {
  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );

  const [expanded, setExpanded] = useState(false);

  const { title, DetailsComponent } = getAccordionContent(selectedElement);

  useEffect(() => {
    setExpanded(!!selectedElement.id);
  }, [selectedElement.id]);

  return (
    <Accordion
      expanded={!!expanded}
      onChange={(e, value) => setExpanded(value)}
      className="Accordions-sidebar"
    >
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
        aria-controls="panel1a-content"
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '0px 0px 0px 10px' }}>
        <form noValidate autoComplete="off" style={{ width: '100%' }}>
          <DetailsComponent />
        </form>
      </AccordionDetails>
    </Accordion>
  );
}

export default ElementDetails;
