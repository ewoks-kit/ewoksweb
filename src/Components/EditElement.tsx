import React, { useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';
import LabelComment from './LabelComment';
import GraphLabelComment from './GraphLabelComment';

function EditElement(props) {
  const { element } = props;

  const [expanded, setExpanded] = React.useState<boolean>(false);

  useEffect(() => {
    setExpanded(!!element.id);
  }, [element.id]);

  const handleChange = (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded);
  };

  return (
    <Accordion expanded={!!expanded} onChange={handleChange}>
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          Edit{' '}
          {'position' in element
            ? 'Node'
            : 'source' in element
            ? 'Link'
            : 'Graph'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form noValidate autoComplete="off">
          {'input_nodes' in element && <GraphLabelComment />}
          {'source' in element && <LinkDetails element={element} />}
          {'position' in element && <NodeDetails element={element} />}
          {(Object.keys(element).includes('position') ||
            Object.keys(element).includes('source')) && (
            <LabelComment element={element} />
          )}
        </form>
      </AccordionDetails>
    </Accordion>
  );
}

export default EditElement;
