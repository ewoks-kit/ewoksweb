/* eslint-disable jsx-a11y/control-has-associated-label */
import { ListItemIcon, ListItemText } from '@material-ui/core';
import type { ChangeEvent, ReactNode } from 'react';

// import { validateEwoksGraph } from '../utils/EwoksValidator';
import useStore from '../../store/useStore';
import type { GraphEwoks, GraphRF } from '../../types';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

async function showFile(e: ChangeEvent<HTMLInputElement>): Promise<FileReader> {
  e.preventDefault();
  const reader: FileReader = new FileReader();
  if (e.target.files?.[0]) {
    reader.readAsText(e.target.files[0]);
  }
  return reader;
}

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (error) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.warn(error);
    return false;
  }
  return true;
}

function MenuUpload(props: { children?: ReactNode } | undefined) {
  const rfInstance = useReactFlow();
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const graphInfo = useStore((state) => state.graphInfo);
  const graphOrSubgraph = useStore<boolean>((state) => state.graphOrSubgraph);

  const workingGraph = useStore<GraphRF>((state) => state.workingGraph);
  const initGraph = useStore((state) => state.initGraph);
  const setSubGraph = useStore((state) => state.setSubGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  async function fileNameChanged(event: ChangeEvent<HTMLInputElement>) {
    if (workingGraph.graph.id === graphInfo.id) {
      const reader = showFile(event);
      const file = await reader.then((val) => val);
      // eslint-disable-next-line require-atomic-updates
      file.onloadend = async () => {
        if (isJsonString(file.result as string)) {
          const newGraph: GraphEwoks = JSON.parse(file.result as string);

          if (graphOrSubgraph) {
            // TODO validate from disk workflows but visualize them
            // const { result } = validateEwoksGraph(newGraph);
            await initGraph(newGraph, 'fromDisk', rfInstance);
          } else {
            const nodes = rfInstance.getNodes();
            const { nodeWithoutData, data } = await setSubGraph(
              newGraph,
              nodes,
              rfInstance.getEdges()
            );
            rfInstance.setNodes([...nodes, nodeWithoutData]);
            setNodeData(nodeWithoutData.id, data);
          }
        } else {
          setOpenSnackbar({
            open: true,
            text:
              'Error in JSON structure. Please correct input file and retry!',
            severity: 'error',
          });
        }
      };
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node-graph to any sub-graph!',
        severity: 'success',
      });
    }
  }

  return (
    <>
      <ListItemIcon>
        <FolderOpenIcon fontSize="small" />
      </ListItemIcon>
      <label htmlFor="load-graph">
        <input
          style={{ display: 'none' }}
          id="load-graph"
          name="load-graph"
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            fileNameChanged(e);
          }}
        />

        <ListItemText primary="Open from disk" style={{ margin: '5px' }} />
        {props?.children || ''}
      </label>
    </>
  );
}

export default MenuUpload;
