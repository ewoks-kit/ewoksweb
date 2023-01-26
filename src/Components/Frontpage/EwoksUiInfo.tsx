// TODO: remove the following after onlyEditRelease
/* eslint-disable @typescript-eslint/no-unused-vars */
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  Fab,
  IconButton,
} from '@material-ui/core';
import SignUp from './SignUp';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import { getWorkflow } from 'api/api';
import useStore from 'store/useStore';
import type { GraphEwoks } from 'types';
import { textForError } from '../../utils';

interface EwoksUiInfoProps {
  closeDialog?(event?: React.KeyboardEvent | React.MouseEvent): void;
}

export default function EwoksUiInfo(props: EwoksUiInfoProps) {
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const closeDialog = async () => {
    if (props.closeDialog) {
      props.closeDialog();
    }
    try {
      const response = await getWorkflow('tutorial_Graph');
      if (response.data) {
        const graph = response.data;

        setOpenSnackbar({
          open: true,
          text: `Workflow ${
            // TODO: perhaps label should be mandatory in the model ?
            // and give one if empty when Ewoks -> EwoksRF...
            graph.graph.label || 'without Label!!!'
          } was downloaded successfully`,
          severity: 'success',
        });
        setWorkingGraph(response.data, 'fromServer');
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Could not locate the requested workflow! Maybe it is deleted!',
          severity: 'warning',
        });
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(
          error,
          'Error in retrieving workflow. Please check connectivity with the server!'
        ),
        severity: 'error',
      });
    }
  };

  return (
    <div className="infoAccordion">
      <Grid container spacing={5} direction="row" alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <SignUp handleCloseDialog={closeDialog} />
        </Grid>
        {/* TODO: commented for onlyEditRelease */}
        {/* <Grid item xs={12} sm={12} md={12} lg={8}>
          <h2 style={{ color: '#3f51b5' }}>
            <IconButton color="inherit" disabled>
              <Fab
                color="primary"
                size="small"
                component="span"
                aria-label="add"
              >
                <NotListedLocationIcon />
              </Fab>
            </IconButton>
            Using Ewoks-UI
          </h2>
          {infoCategories.map(({ summary, details }) => (
            <Accordion key={summary}>
              <AccordionSummary
                expandIcon={<OpenInBrowser />}
                aria-controls="panel1a-content"
              >
                <Typography>{summary}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography> */}
        {/* The following will be deleted once decided how the documentation will be displayed */}

        {/* <span dangerouslySetInnerHTML={{ __html: details }} />
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid> */}
      </Grid>
    </div>
  );
}
const UD = 'Under Development';

const infoCategories = [
  {
    summary: 'Create a graph',
    details: UD,
  },
  {
    summary: 'Nodes editing details',
    details: `details`,
  },
  { summary: 'Nodes style editing', details: UD },
  { summary: 'Links editing details', details: UD },
  { summary: 'Clone Node, Graph', details: UD },
  { summary: 'Manage Icons', details: UD },
  { summary: 'Manage Tasks', details: UD },
  { summary: 'other', details: UD },
];
