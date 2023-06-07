import Upload from '../General/Upload';
import { Add } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import useStore from '../../store/useStore';

function AddSubgraphButton() {
  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  const insertGraph = () => {
    setGraphOrSubgraph(false);
  };

  return (
    <Upload>
      <Tooltip title="Add a subgraph from disk" arrow>
        <span
          role="button"
          tabIndex={0}
          onClick={insertGraph}
          onKeyPress={insertGraph}
          data-testid="addSubgraphFromDisk"
        >
          <Add />G
        </span>
      </Tooltip>
    </Upload>
  );
}

export default AddSubgraphButton;
