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
import ElementDetails from './details/ElementDetails';
import EditElementStyle from './edit/EditElementStyle';
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
import { deleteWorkflow } from 'api/api';
import { OpenInBrowser } from '@material-ui/icons';
import SidebarTooltip from './SidebarTooltip';
import { getIcons as getIconsFromServer } from 'api/icons';
import commonStrings from 'commonStrings.json';
import { isLink, isNode } from '../../utils/typeGuards';
import { textForError } from '../../utils';

const useStyles = DashboardStyle;

export default function Sidebar() {
  const classes = useStyles();

  const selectedElement = useStore<EwoksRFNode | EwoksRFLink | GraphDetails>(
    (state) => state.selectedElement
  );
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const [openExecutionDetails, setOpenExecutionDetails] = useState<boolean>(
    false
  );
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const resetRecentGraphs = useStore((state) => state.resetRecentGraphs);
  const initializedRFGraph = useStore((state) => state.initializedRFGraph);
  const setUndoRedo = useStore((state) => state.setUndoRedo);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setAllIcons = useStore((state) => state.setAllIcons);

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
        text: textForError(error, commonStrings.retrieveIconsError),
        severity: 'error',
      });
    }
  }, [setOpenSnackbar, setAllIcons]);

  useEffect(() => {
    getIcons();
  }, [getIcons]);

  const deleteElement = async () => {
    if (workingGraph.graph.id !== graphRF.graph.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to delete any element in a sub-graph!',
        severity: 'success',
      });
      return;
    }

    if (isNode(selectedElement)) {
      const nodesLinks = graphRF.links.filter(
        (link) =>
          !(
            link.source === selectedElement.id ||
            link.target === selectedElement.id
          )
      );

      const newGraph: GraphRF = {
        ...graphRF,
        nodes: graphRF.nodes.filter((nod) => nod.id !== selectedElement.id),
        links: nodesLinks,
      };

      setUndoRedo({
        action: 'Removed a Node',
        graph: newGraph,
      });
      setGraphRF(newGraph, true);
      return;
    }

    if (isLink(selectedElement)) {
      const newGraph: GraphRF = {
        ...graphRF,
        links: graphRF.links.filter((link) => link.id !== selectedElement.id),
      };

      setUndoRedo({
        action: 'Removed a Link',
        graph: newGraph,
      });
      setGraphRF(newGraph, true);
      return;
    }

    if ('input_nodes' in selectedElement) {
      setOpenAgreeDialog(true);
      return;
    }

    setOpenSnackbar({
      open: true,
      text: 'Nothing to delete!',
      severity: 'error',
    });
  };

  const agreeCallback = async () => {
    setOpenAgreeDialog(false);
    if (selectedElement.id) {
      try {
        await deleteWorkflow(selectedElement.id);
        setOpenSnackbar({
          open: true,
          text: `Workflow ${selectedElement.id} successfully deleted!`,
          severity: 'success',
        });
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.deletingError),
          severity: 'error',
        });
      }
    }

    setGraphRF(initializedRFGraph);
    setSelectedElement({} as GraphDetails);
    setSubgraphsStack({ id: '', label: '', resetStack: true });
    resetRecentGraphs();
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  const cloneNode = () => {
    if (isNode(selectedElement)) {
      const newClone: EwoksRFNode = {
        ...selectedElement,
        id: calcNewId(selectedElement.id, graphRF.nodes),
        selected: false,
        position: {
          x: selectedElement.position?.x || 0 + 100,
          y: selectedElement.position?.y || 0 + 100,
        },
      };
      const newGraph = {
        ...graphRF,
        nodes: [...graphRF.nodes, newClone],
      };

      setGraphRF(newGraph, true);

      setUndoRedo({ action: 'Cloned a Node', graph: newGraph });
      setSelectedElement(newClone);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Clone is for cloning nodes within the working workflow',
        severity: 'warning',
      });
    }
  };

  // const handleChangeExecutionDetails = (
  //   event: React.SyntheticEvent,
  //   expand: boolean
  // ) => {
  //   setOpenExecutionDetails(expand);
  // };

  return (
    <aside className="dndflow">
      {!inExecutionMode && (
        <>
          <AddNodes title="Add Nodes" />
          <ElementDetails />
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
            onClick={() => {
              deleteElement();
            }}
            size="small"
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
          {!isLink(selectedElement) && <IconMenu />}
          <ConfirmDialog
            title={`Delete "${
              selectedElement.label || 'not labelled'
            }" workflow?`}
            content={`You are about to delete "${
              selectedElement.label || 'a not labelled'
            }" workflow.
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
