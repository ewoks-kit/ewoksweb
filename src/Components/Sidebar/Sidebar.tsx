// TODO: remove the following after onlyEditRelease
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@material-ui/core';
import AddNodes from './AddNodes';
import EditElement from './EditElement';
import EditElementStyle from './EditElementStyle';
import DraggableDialog from '../General/DraggableDialog';
import IconMenu from './IconMenu';
import ExecutionDetails from '../Execution/ExecutionDetails';
import DashboardStyle from '../Dashboard/DashboardStyle';
import useStore from 'store/useStore';
import type {
  EwoksRFNode,
  EwoksRFLink,
  GraphDetails,
  GraphRF,
  Icon,
} from 'types';
import { calcNewId } from 'utils/calcNewId';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { deleteWorkflow } from 'utils/api';
import { OpenInBrowser } from '@material-ui/icons';
import SidebarTooltip from './SidebarTooltip';
import getIconsFromServer from '../../utils/getIconsFromServer';
import commonStrings from 'commonStrings.json';

const useStyles = DashboardStyle;

export default function Sidebar() {
  const classes = useStyles();

  const selectedElement = useStore<EwoksRFNode | EwoksRFLink | GraphDetails>(
    (state) => state.selectedElement
  );
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const [element, setElement] = useState<
    EwoksRFNode | EwoksRFLink | GraphDetails
  >({});
  const [openExecutionDetails, setOpenExecutionDetails] = useState<boolean>(
    false
  );
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [openDialog] = useState<boolean>(false);
  const [dialogContent] = useState({});
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const initializedRFGraph = useStore((state) => state.initializedRFGraph);
  const setUndoRedo = useStore((state) => state.setUndoRedo);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setAllIcons = useStore((state) => state.setAllIcons);

  useEffect(() => {
    setElement(selectedElement);
  }, [selectedElement]);

  // TODO: similar getIcons is used in manage icons. Should we move it to a hook?
  const getIcons = useCallback(async () => {
    try {
      const icons: Icon[] | object = await getIconsFromServer();

      if (Array.isArray(icons) && icons.length > 0) {
        setAllIcons(icons);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || commonStrings.retrieveIconsError,
        severity: 'error',
      });
    }
  }, [setOpenSnackbar, setAllIcons]);

  useEffect(() => {
    getIcons();
  }, [getIcons]);

  const deleteElement = async () => {
    let newGraph = {} as GraphRF;

    const elN = element as EwoksRFNode; // TODO: is this the way to avoid typescript warning???
    const elL = element as EwoksRFLink;
    const elD = element as GraphDetails;
    if (elN.position) {
      const nodesLinks = graphRF.links.filter(
        (link) => !(link.source === elN.id || link.target === elN.id)
      );

      newGraph = {
        ...graphRF,
        nodes: graphRF.nodes.filter((nod) => nod.id !== element.id),
        links: nodesLinks,
      };

      setUndoRedo({
        action: 'Removed a Node',
        graph: newGraph,
      });
    } else if (elL.source) {
      newGraph = {
        ...graphRF,
        links: graphRF.links.filter((link) => link.id !== elL.id),
      };

      setUndoRedo({
        action: 'Removed a Link',
        graph: newGraph,
      });
    }

    if (elD.input_nodes) {
      setOpenAgreeDialog(true);
    } else if (!elD.input_nodes) {
      if (workingGraph.graph.id === graphRF.graph.id) {
        setGraphRF(newGraph, true);
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Not allowed to delete any element in a sub-graph!',
          severity: 'success',
        });
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Nothing to delete!',
        severity: 'error',
      });
    }
  };

  const agreeCallback = async () => {
    setOpenAgreeDialog(false);
    try {
      await deleteWorkflow(element.id);
      setOpenSnackbar({
        open: true,
        text: `Workflow ${element.id} succesfully deleted!`,
        severity: 'success',
      });
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.message,
        severity: 'error',
      });
    }

    setGraphRF(initializedRFGraph);
    setSelectedElement({} as GraphDetails);
    setSubgraphsStack({ id: 'initialiase', label: '' });
    setRecentGraphs({} as GraphRF, true);
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  const cloneNode = () => {
    if ('position' in selectedElement) {
      const newClone = {
        ...selectedElement,
        id: calcNewId(selectedElement.id, graphRF.nodes),
        selected: false,
        position: {
          x: selectedElement.position.x + 100,
          y: selectedElement.position.y + 100,
        },
      };
      const newGraph = {
        ...graphRF,
        nodes: [...graphRF.nodes, newClone],
      };

      setGraphRF(newGraph, true);

      setUndoRedo({ action: 'Cloned a Node', graph: newGraph });
      setSelectedElement(newClone as EwoksRFNode);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Clone is for cloning nodes within the working workflow',
        severity: 'warning',
      });
    }
  };

  const handleChangeExecutionDetails = (
    event: React.SyntheticEvent,
    expand: boolean
  ) => {
    setOpenExecutionDetails(expand);
  };

  return (
    <aside className="dndflow">
      {!inExecutionMode && (
        <>
          <AddNodes title="Add Nodes" />
          <EditElement />
          <EditElementStyle />
        </>
      )}
      {/* TODO: commented for onlyEditRelease */}
      {/* <Accordion
        expanded={openExecutionDetails}
        onChange={handleChangeExecutionDetails}
        className="Accordions-sidebar"
      >
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          className="Accordions-sidebar"
        >
          <SidebarTooltip
            text={`Drag and drop Tasks from their categories
          to the canvas to create graphs.`}
          >
            <Typography>Execution History</Typography>
          </SidebarTooltip>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap', padding: '4px' }}>
          <div className={classes.executionSide}>
            <ExecutionDetails />
          </div>
        </AccordionDetails>
      </Accordion> */}
      {!inExecutionMode && (
        <>
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="secondary"
            onClick={deleteElement}
            size="small"
            data-cy="sidebarDelete"
          >
            Delete
          </Button>
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="primary"
            onClick={cloneNode}
            size="small"
            data-cy="cloneButton"
          >
            Clone
          </Button>
          {!('source' in selectedElement) && <IconMenu />}
          <DraggableDialog open={openDialog} content={dialogContent} />
          <ConfirmDialog
            title={`Delete "${element.label}" workflow?`}
            content={`You are about to delete "${element.label}" workflow.
              Please make sure that it is not used as a subgraph in other workflows!
              Do you agree to continue?`}
            open={openAgreeDialog}
            agreeCallback={agreeCallback}
            disagreeCallback={disAgreeCallback}
          />
        </>
      )}
    </aside>
  );
}
