import DashboardStyle from '../layout/DashboardStyle';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Upload from '../Components/Upload';
import AddIcon from '@material-ui/icons/Add';
import { rfToEwoks } from '../utils';
import useStore from '../store';

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

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const graphRF = useStore((state) => state.graphRF);

  const loadFromDisk = (val) => {
    // TODO: possible race situation with setting pgraphOrSubgraph
    setGraphOrSubgraph(true);
  };

  const saveToDisk = (event) => {
    download(
      JSON.stringify(rfToEwoks(graphRF), null, 2),
      `${graphRF.graph.label}.json`,
      'text/plain'
    );
  };

  return (
    <>
      <Tooltip title="Save to Disk" arrow>
        <IconButton color="inherit">
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
          >
            <SaveIcon onClick={saveToDisk} />
          </Fab>
        </IconButton>
      </Tooltip>
      <Tooltip title="Load from Disk" arrow>
        <IconButton color="inherit">
          <Upload>
            <AddIcon onClick={loadFromDisk} />
          </Upload>
        </IconButton>
      </Tooltip>
    </>
  );
}
