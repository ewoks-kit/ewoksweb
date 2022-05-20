import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import AddNodes from '../Components/AddNodes';
import EditElement from '../Components/EditElement';
import EditElementStyle from '../Components/EditElementStyle';
import DraggableDialog from '../Components/DraggableDialog';
import IconMenu from '../Components/IconMenu';
import SettingsInfoDrawer from '../Components/SettingsInfoDrawer';
import ExecutionDetails from '../Components/ExecutionDetails';
import DashboardStyle from './DashboardStyle';
import state from '../store/state';
import type {
  EwoksRFNode,
  EwoksRFLink,
  GraphDetails,
  GraphRF,
  IconsNames,
  SvgIcons,
} from '../types';
import { rfToEwoks } from '../utils';
import ConfirmDialog from '../Components/ConfirmDialog';
import { deleteWorkflow, getIcon, getIcons, getOtherIcon } from '../utils/api';
import axios from 'axios';

const useStyles = DashboardStyle;

const getIconsL = async () => {
  const iconsData: IconsNames = await getIcons();
  console.log(typeof iconsData.identifiers, iconsData.identifiers);
  return iconsData.identifiers;
};

export default function Sidebar() {
  const classes = useStyles();

  const selectedElement = state<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const setSelectedElement = state((state) => state.setSelectedElement);

  const [element, setElement] = React.useState<EwoksRFNode | EwoksRFLink>(
    {} as EwoksRFNode | EwoksRFLink
  );
  const graphRF = state((state) => state.graphRF);
  const setGraphRF = state((state) => state.setGraphRF);
  const workingGraph = state((state) => state.workingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dialogContent, setDialogContent] = React.useState({});
  const setSubgraphsStack = state((state) => state.setSubgraphsStack);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const initializedGraph = state((state) => state.initializedGraph);
  const setUndoRedo = state((state) => state.setUndoRedo);
  const isExecuted = state((state) => state.isExecuted);
  const [openAgreeDialog, setOpenAgreeDialog] = React.useState<boolean>(false);
  const setAllIcons = state((state) => state.setAllIcons);
  const allIcons = state((state) => state.allIcons);
  const setAllSvgIcons = state((state) => state.setAllIcons);
  // const allIcons = state((state) => state.allIcons);
  const [testImage, setTestImage] = React.useState<string>('');

  useEffect(() => {
    setElement(selectedElement);

    const fetchIcons = async () => {
      const data = await getIcons();

      // const tempPng = await
      getOtherIcon('orange1.png').then((r) => {
        // (TypeError): URL.createObjectURL: Argument 1 is not valid for any of the 1-argument overloads.
        // console.log(URL.createObjectURL(r.data));

        // const base64String = btoa(
        //   String.fromCharCode(...new Uint8Array(r.data)) // needs arratBufferLike
        // );

        console.log(r);
        const blo = r.data as Blob;
        const fileReader = new FileReader();
        // const arB = fileReader.readAsArrayBuffer(blo);

        // return arB.arrayBuffer();
      });
      // .then((buffer) => {
      //   // note this is already an ArrayBuffer
      //   // there is no buffer.data here
      //   const blob = new Blob([buffer]);
      //   const url = URL.createObjectURL(blob);
      //   console.log(url);
      // });
      // console.log(tempPng, typeof tempPng.data);
      // const blobURL = tempPng.data.arrayBuffer();
      // URL.createObjectURL(tempPng.data);
      // setTestImage(blobURL);

      // tempPng.arrayBuffer().then(function (buffer) {
      //   const url = window.URL.createObjectURL(new Blob([buffer]));
      //   const link = document.createElement('a');
      //   link.href = url;
      //   link.setAttribute('download', 'image.png'); //or any other extension
      //   document.body.append(link);
      //   link.click();
      // });
      // console.log(tempPng);

      const icons = data.identifiers
        // .map((str) => str.slice(6))
        .filter((str) => {
          return str.endsWith('svg');
        });
      console.log(typeof icons, icons, Array.isArray(icons), icons.length);
      if (allIcons.length <= 1) {
        setAllIcons(icons);
        const results = await axios
          .all(icons.map((id: string) => getIcon(id)))
          .then(
            axios.spread((...res) => {
              console.log(res);
              const resCln = res.filter((result) => result.data !== null);
              return resCln.map((result) => result.data);
            })
          )
          .catch((error) => {
            // remove after handling the error
            console.log('AXIOS ERROR', error);
            return [];
          });
        console.log(results);
        setAllSvgIcons(results);
      }
    };

    fetchIcons().catch((error) => console.log(error));
    // const icons = getIconsL();
    // setAllIcons(icons);
  }, [selectedElement, allIcons.length, setAllIcons, setAllSvgIcons]);

  const deleteElement = async () => {
    let newGraph = {} as GraphRF;
    // console.log(element);
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

    if (elD.input_nodes && elD.id !== 'newGraph') {
      setOpenAgreeDialog(true);
    } else if (!elD.input_nodes) {
      if (workingGraph.graph.id === graphRF.graph.id) {
        setGraphRF(newGraph);
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

  const showEwoksGraph = () => {
    setOpenDialog(true);
    setDialogContent({
      title: 'Ewoks Graph',
      object: rfToEwoks(graphRF),
      openFrom: 'sidebar',
    });
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

    setGraphRF(initializedGraph);
    setSelectedElement({} as GraphDetails);
    setSubgraphsStack({ id: 'initialiase', label: '' });
    setRecentGraphs({} as GraphRF, true);
    // setDialogContent({
    //   title: 'Ewoks Graph',
    //   object: rfToEwoks(graphRF),
    //   openFrom: 'sidebar',
    // });
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  return (
    <aside className="dndflow">
      {isExecuted ? (
        <div className={classes.executionSide}>
          <ExecutionDetails
          // props={{
          //   selectedElement,
          // }}
          // setElement={setElement}
          />
        </div>
      ) : (
        <>
          <img id="myImage" src="" alt="sdc"></img>
          <AddNodes title="Add Nodes" />
          <EditElement element={selectedElement} />
          <EditElementStyle />
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="secondary"
            onClick={deleteElement}
            size="small"
          >
            Delete
          </Button>
          {!('source' in selectedElement) && (
            <IconMenu handleShowEwoksGraph={showEwoksGraph} />
          )}
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
      <SettingsInfoDrawer />
    </aside>
  );
}
