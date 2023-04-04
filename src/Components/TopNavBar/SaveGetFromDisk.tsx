import DashboardStyle from '../Dashboard/DashboardStyle';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Upload from '../General/Upload';
import tooltipText from '../General/TooltipText';
import { getEdgesData, getNodesData, rfToEwoks } from '../../utils';

import useStore from '../../store/useStore';
import type { EwoksRFLinkData, EwoksRFNodeData, GraphRF } from '../../types';
import { useReactFlow } from 'reactflow';

const useStyles = DashboardStyle;

function download(content: BlobPart, fileName: string, contentType: string) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export default function SaveGetFromDisk() {
  const classes = useStyles();

  const { getNodes, getEdges } = useReactFlow();

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const graphInfo = useStore((state) => state.graphInfo);
  const inExecutionMode = useStore((state) => state.inExecutionMode);

  function loadFromDisk() {
    setGraphOrSubgraph(true);
  }

  function saveToDisk() {
    if (graphInfo.label) {
      const graphRf: GraphRF = {
        graph: graphInfo,
        nodes: getNodes().map((nod) => {
          return {
            ...nod,
            data: getNodesData().get(nod.id) as EwoksRFNodeData,
          };
        }),
        links: getEdges().map((edge) => {
          return {
            ...edge,
            data: getEdgesData().get(edge.id) as EwoksRFLinkData,
          };
        }),
      };
      download(
        JSON.stringify(rfToEwoks(graphRf), null, 2),
        `${graphInfo.label}.json`,
        'text/plain'
      );
    }
  }

  return (
    <>
      <Tooltip title={tooltipText('Save to local disk')} enterDelay={800} arrow>
        <span>
          <IconButton color="inherit" onClick={saveToDisk}>
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="add"
            >
              <SaveIcon />
            </Fab>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        title={tooltipText('Load from local disk')}
        enterDelay={800}
        arrow
      >
        <span>
          <IconButton
            color="inherit"
            disabled={inExecutionMode}
            onClick={loadFromDisk}
          >
            <Upload>
              <FolderOpenIcon />
            </Upload>
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
