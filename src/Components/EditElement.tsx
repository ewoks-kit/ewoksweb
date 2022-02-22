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

function EditElement(propsIn) {
  const { props } = propsIn;
  const { element } = props;
  const { setElement } = propsIn;

  useEffect(() => {
    console.log(element.label);
  }, [element.id, element.label]);

  return (
    <Accordion>
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
          {'input_nodes' in element && (
            <GraphLabelComment
              props={{
                ...props,
              }}
              setElement={setElement}
            />
          )}
          {'source' in element && (
            <LinkDetails
              props={{
                ...props,
              }}
              setElement={setElement}
            />
          )}
          {'position' in element && (
            <NodeDetails
              props={{
                ...props,
              }}
              setElement={setElement}
            />
          )}
          {(Object.keys(element).includes('position') ||
            Object.keys(element).includes('source')) && (
            <LabelComment
              props={{
                ...props,
              }}
              setElement={setElement}
            />
          )}
        </form>
      </AccordionDetails>
    </Accordion>
  );
}

export default EditElement;
