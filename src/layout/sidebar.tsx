import React, { useEffect, useState } from 'react';
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
import type { EwoksRFNode, EwoksRFLink, GraphDetails, GraphRF } from '../types';
import { rfToEwoks } from '../utils';
import { calcNewId } from '../utils/calcNewId';
import ConfirmDialog from '../Components/ConfirmDialog';
import { deleteWorkflow, getIcon, getIcons, getOtherIcon } from '../utils/api';
import axios from 'axios';
import path from 'path';

const useStyles = DashboardStyle;

// const getIconsL = async () => {
//   const iconsData: IconsNames = await getIcons();
//   console.log(typeof iconsData.identifiers, iconsData.identifiers);
//   return iconsData.identifiers;
// };

// const increment = (nodeId: string, nodes: EwoksRFNode[]) => {
//   let id = 0;
//   while (nodes.map((nod) => nod.id).includes(`${nodeId}_${id}`)) {
//     id++;
//   }
//   return `${nodeId}_${id}`;
// };

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
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState({});
  const setSubgraphsStack = state((state) => state.setSubgraphsStack);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const initializedGraph = state((state) => state.initializedGraph);
  const setUndoRedo = state((state) => state.setUndoRedo);
  const isExecuted = state((state) => state.isExecuted);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setAllIcons = state((state) => state.setAllIcons);
  const allIcons = state((state) => state.allIcons);
  const setAllIconNames = state((state) => state.setAllIconNames);
  // const allIconNames = state((state) => state.allIconNames);
  // const [testImage, setTestImage] = React.useState<string>();

  useEffect(() => {
    setElement(selectedElement);

    const fetchIcons = async () => {
      if (allIcons.length <= 1) {
        const data = await getIcons();
        // console.log(data);
        // get the non svg image icons(png)
        const iconsPng = data.identifiers
          // .map((str) => str.slice(6))
          .filter((str) => {
            return !str.endsWith('svg');
          });
        // const resultsPng = [];

        await axios
          .all(iconsPng.map((id: string) => getOtherIcon(id)))
          .then(
            axios.spread((...resPng) => {
              // console.log(resPng);
              const resCln = resPng.filter((result) => result.data !== null);
              return resCln.map((result) => {
                const blobPng = new Blob([result.data], { type: 'image/png' });
                const fileReader = new FileReader();
                fileReader.readAsDataURL(blobPng);
                // fileReader.addEventListener('load', handleReader);

                // function handleReader() {
                //   // resultsPng.push({ name: theId, image: fileReader.result });
                // }
                return result.data;
              });
            })
          )
          .catch((error) => {
            // remove after handling the error
            setOpenSnackbar({
              open: true,
              text: error.data,
              severity: 'error',
            });
            return [];
          });
        // console.log(resultsPng);

        // getOtherIcon('orange1.png').then((r) => {
        //   // console.log(r, typeof r.data);
        //   const blo = r.data;
        //   const blob1 = new Blob([blo], { type: 'image/png' });
        //   // console.log(blob1);
        //   const fileReader = new FileReader();
        //   fileReader.readAsDataURL(blob1);
        //   fileReader.addEventListener('load', handleReader);

        //   function handleReader() {
        //     // console.log(fileReader.result);
        //     setTestImage(fileReader.result as string);
        //   }
        // });

        // get the svg icons
        const iconsSvg = data.identifiers
          // .map((str) => str.slice(6))
          .filter((str) => {
            return str.endsWith('svg');
          });
        // console.log(typeof iconsSvg, iconsSvg, Array.isArray(iconsSvg));
        // TODO: if icons wont be downloaded due to a server issue it enters a infinite loop of requests

        setAllIconNames(iconsSvg);
        const results = await axios
          .all(iconsSvg.map((id: string) => getIcon(id)))
          .then(
            axios.spread((...res) => {
              const resCln = res.filter((result) => result.data !== null);
              return resCln.map((result) => {
                return {
                  name: path.basename(result.config.url),
                  image: result.data,
                  type: path.extname(result.config.url),
                };
              });
            })
          )
          .catch((error) => {
            // remove after handling the error
            setOpenSnackbar({
              open: true,
              text: error.data,
              severity: 'warning',
            });
            return [];
          });
        // console.log(results);
        setAllIcons(results);
      }
    };
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    fetchIcons().catch((error) => {
      /* eslint-disable no-console */
      console.log(error);
    });
    // const icons = getIconsL();
    // setAllIcons(icons);
  }, [
    selectedElement,
    allIcons.length,
    setAllIcons,
    setAllIconNames,
    // testImage,
    setOpenSnackbar,
  ]);

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

  const cloneNode = () => {
    if ('position' in selectedElement) {
      const newClone = {
        ...selectedElement,
        id: selectedElement.id + calcNewId(selectedElement.id, graphRF.nodes),
        selected: false,
        position: {
          x: selectedElement.position.x + 100,
          y: selectedElement.position.y + 100,
        },
      };
      setGraphRF({
        ...graphRF,
        nodes: [...graphRF.nodes, newClone],
      });
      setSelectedElement(newClone as EwoksRFNode);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Clone is for cloning nodes within the working workflow',
        severity: 'warning',
      });
    }
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
          {/* <img src={testImage} alt="sdc"></img> */}
          {/* {allIcons &&
            allIcons.length > 0 &&
            allIcons.map((icon) => (
              <img
                src={`data:image/svg+xml;utf8,${icon.image}`}
                alt={icon.name}
              />
            ))} */}
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
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="primary"
            onClick={cloneNode}
            size="small"
          >
            Clone
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
