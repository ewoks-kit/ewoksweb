import React, { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TabPanel from './TabPanel';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';

type Anchor = 'top' | 'left' | 'bottom' | 'right';
// TODO: to decide if only top is needed and local state of the drawer
export default function TemporaryDrawer(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  useEffect(() => {
    const opSet: boolean = props.openSettings;
    setState({ top: opSet, left: false, bottom: false, right: false });
  }, [props.openSettings]);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    props.handleOpenSettings();
    setState({ ...state, [anchor]: open }); // left: open , for opening both-active 1
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 350 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      {props.openInfo ? (
        <div className="infoAccordion">
          <h2 style={{ color: '#5595ce' }}>Using Ewoks user Interface</h2>
          <Accordion>
            <AccordionSummary
              expandIcon={<OpenInBrowser />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Create a graph</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<OpenInBrowser />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Nodes editing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<OpenInBrowser />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Nodes style editing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<OpenInBrowser />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography>Links editing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget. fgbvfgbfgb
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* <ul>
            <li>Create a graph</li>
            <li>Nodes editing</li>
            <li>Nodes style editing</li>
            <li>Links editing</li>
            <li>Links style editing</li>
            <li>Clone Node, Graph</li>
            <li>Manage Icons</li>
            <li>Manage Tasks</li>
          </ul> */}
        </div>
      ) : (
        <TabPanel />
      )}
      <Divider />
    </Box>
  );

  return (
    <div>
      {(['left', 'top', 'right'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
