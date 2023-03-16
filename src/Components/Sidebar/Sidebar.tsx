// TODO: remove the following after onlyEditRelease
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  Button,
  // Typography,
} from '@material-ui/core';
import AddNodes from './AddNodes';
import ElementDetails from './details/ElementDetails';
import EditElementStyle from './edit/EditElementStyle';
import IconMenu from './IconMenu';
// import ExecutionDetails from '../Execution/ExecutionDetails';
import DashboardStyle from '../Dashboard/DashboardStyle';
import useStore from 'store/useStore';
import type { EwoksRFNode, EwoksRFLink, GraphDetails } from 'types';
import { calcNewId } from 'utils/calcNewId';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { deleteWorkflow } from 'api/api';
// import { OpenInBrowser } from '@material-ui/icons';
// import SidebarTooltip from './SidebarTooltip';
import commonStrings from 'commonStrings.json';
import { isGraphDetails, isLink, isNode } from '../../utils/typeGuards';
import { textForError } from '../../utils';
import { useNodesIds, useSelectedElement } from '../../store/graph-hooks';
import { useReactFlow } from 'reactflow';

const useStyles = DashboardStyle;

export default function Sidebar() {
  const classes = useStyles();

  const nodesIds = useNodesIds();
  const { deleteElements, getNodes, setNodes, getEdges } = useReactFlow();

  const selectedElement = useSelectedElement();

  const setSelectedElement = useStore((state) => state.setSelectedElement);

  // const [openExecutionDetails, setOpenExecutionDetails] = useState<boolean>(
  //   false
  // );
  const graphRFDetails = useStore((state) => state.graphRFDetails);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const resetRecentGraphs = useStore((state) => state.resetRecentGraphs);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);

  const deleteElement = async () => {
    if (workingGraph.graph.id !== graphRFDetails.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to delete any element in a sub-graph!',
        severity: 'success',
      });
      return;
    }

    if (isNode(selectedElement)) {
      setSelectedElement(graphRFDetails);
      deleteElements({ nodes: [selectedElement] });
      return;
    }

    if (isLink(selectedElement)) {
      setSelectedElement(graphRFDetails);
      deleteElements({ edges: [selectedElement] });
      return;
    }

    if (isGraphDetails(selectedElement)) {
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

    setWorkingGraph(initializedGraph);
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
        id: calcNewId(selectedElement.id, nodesIds),
        selected: false,
        position: {
          x: (selectedElement.position?.x || 0) + 100,
          y: (selectedElement.position?.y || 0) + 100,
        },
      };
      const nodesRF = getNodes();
      setNodes([...nodesRF, newClone]);
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
              (isGraphDetails(selectedElement) && selectedElement.label) ||
              'not labelled'
            }" workflow?`}
            content={`You are about to delete "${
              (isGraphDetails(selectedElement) && selectedElement.label) ||
              'a not labelled'
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
