import DashboardStyle from '../layout/DashboardStyle';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Upload from '../Components/Upload';
import tooltipText from '../Components/TooltipText';
import { rfToEwoks } from '../utils';

import state from '../store/state';

const useStyles = DashboardStyle;

function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export default function SaveGetFromDisk() {
  const classes = useStyles();

  const setGraphOrSubgraph = state((state) => state.setGraphOrSubgraph);
  const graphRF = state((state) => state.graphRF);
  const isExecuted = state((state) => state.isExecuted);

  const loadFromDisk = () => {
    setGraphOrSubgraph(true);
  };

  const saveToDisk = () => {
    download(
      JSON.stringify(rfToEwoks(graphRF), null, 2),
      `${graphRF.graph.label}.json`,
      'text/plain'
    );
  };

  return (
    <>
      <Tooltip title={tooltipText('Save to local disk')} enterDelay={800} arrow>
        <IconButton color="inherit" onClick={saveToDisk}>
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            disabled={isExecuted}
          >
            <SaveIcon />
          </Fab>
        </IconButton>
      </Tooltip>
      <Tooltip
        title={tooltipText('Load from local disk')}
        enterDelay={800}
        arrow
      >
        <IconButton
          color="inherit"
          disabled={isExecuted}
          onClick={loadFromDisk}
        >
          <Upload>
            <FolderOpenIcon />
          </Upload>
        </IconButton>
      </Tooltip>
    </>
  );
}
