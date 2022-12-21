/* eslint-disable jsx-a11y/control-has-associated-label */
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import type { ChangeEvent } from 'react';

// import { validateEwoksGraph } from '../utils/EwoksValidator';
import useStore from '../../store/useStore';
import type { GraphEwoks, GraphRF } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
    openFileButton: {
      backgroundColor: '#96a5f9',
    },
  })
);

async function showFile(e: ChangeEvent<HTMLInputElement>): Promise<FileReader> {
  e.preventDefault();
  const reader: FileReader = new FileReader();
  reader.readAsText(e.target.files[0]);
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

function Upload(props) {
  const classes = useStyles();

  const graphRF = useStore<GraphRF>((state) => state.graphRF);
  const graphOrSubgraph = useStore<boolean>((state) => state.graphOrSubgraph);

  const workingGraph = useStore<GraphRF>((state) => state.workingGraph);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setSubGraph = useStore((state) => state.setSubGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const inExecutionMode = useStore<boolean>((state) => state.inExecutionMode);

  async function fileNameChanged(event: ChangeEvent<HTMLInputElement>) {
    if (workingGraph.graph.id === graphRF.graph.id) {
      const reader = showFile(event);
      const file = await reader.then((val) => val);
      // eslint-disable-next-line require-atomic-updates
      file.onloadend = async () => {
        if (isJsonString(file.result as string)) {
          const newGraph: GraphEwoks = JSON.parse(file.result as string);

          if (graphOrSubgraph) {
            // TODO validate from disk workflows but visualize them
            // const { result } = validateEwoksGraph(newGraph);
            // if (result) {
            await setWorkingGraph(newGraph, 'fromDisk');
            // }
          } else {
            await setSubGraph(newGraph);
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
    <div>
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
        <Fab
          className={classes.openFileButton}
          color="primary"
          size="small"
          component="span"
          aria-label="add"
          disabled={inExecutionMode}
        >
          {props.children}
        </Fab>
      </label>
    </div>
  );
}

export default Upload;
