import React, { useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import GraphLabelComment from './GraphLabelComment';
import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../../types';
import useStore from '../../store/useStore';

interface Content {
  title: string;
  EditComponent: () => JSX.Element;
}

function getAccordionContent(
  element: EwoksRFNode | EwoksRFLink | GraphDetails
): Content {
  if ('position' in element) {
    return {
      title: 'Node Details',
      EditComponent: () => <NodeDetails {...element} />,
    };
  }

  if ('source' in element) {
    return {
      title: 'Link Details',
      EditComponent: () => <LinkDetails {...element} />,
    };
  }

  return {
    title: 'Graph Details',
    EditComponent: () => <GraphLabelComment />,
  };
}

// DOC: Container for link-node-graph editing details
function ElementDetails() {
  const selectedElement = useStore((state) => state.selectedElement);

  const [expanded, setExpanded] = React.useState<boolean>(false);

  const content = getAccordionContent(selectedElement);

  const { title, EditComponent } = content;

  useEffect(() => {
    setExpanded(!!selectedElement.id);
  }, [selectedElement.id]);

  const handleChange = (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded);
  };

  return (
    <Accordion
      expanded={!!expanded}
      onChange={handleChange}
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
          <EditComponent />
        </form>
      </AccordionDetails>
    </Accordion>
  );
}

export default ElementDetails;
