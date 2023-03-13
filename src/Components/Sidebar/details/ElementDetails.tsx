import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import GraphDetails from './GraphDetails';
import { isLink, isNode } from '../../../utils/typeGuards';
import type { EwoksRFElement } from '../models';
import { useEffect, useState } from 'react';
import useSelectedElementStore from '../../../store/useSelectedElementStore';
import { useReactFlow } from 'reactflow';
import useStore from '../../../store/useStore';

interface Content {
  title: string;
  DetailsComponent: () => JSX.Element;
}

function getAccordionContent(element: EwoksRFElement): Content {
  if (isNode(element)) {
    return {
      title: 'Node Details',
      DetailsComponent: () => <NodeDetails {...element} />,
    };
  }

  if (isLink(element)) {
    return {
      title: 'Link Details',
      DetailsComponent: () => <LinkDetails {...element} />,
    };
  }

  return {
    title: 'Graph Details',
    DetailsComponent: () => <GraphDetails {...element} />,
  };
}

// DOC: Container for link-node-graph editing details
function ElementDetails() {
  const selectedElementNew = useSelectedElementStore(
    (state) => state.selectedElement
  );
  const graphRFDetails = useStore((state) => state.graphRFDetails);

  const { getNodes, getEdges } = useReactFlow();

  const selectedElement =
    selectedElementNew.type === 'node'
      ? getNodes().find((node) => node.id === selectedElementNew.id)
      : selectedElementNew.type === 'edge'
      ? getEdges().find((edge) => edge.id === selectedElementNew.id)
      : graphRFDetails;

  const [expanded, setExpanded] = useState(false);

  const { title, DetailsComponent } = getAccordionContent(
    selectedElement as EwoksRFElement
  );

  useEffect(() => {
    setExpanded(!!selectedElement?.id);
  }, [selectedElement?.id]);

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
