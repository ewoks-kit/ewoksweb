import Tooltip from '@material-ui/core/Tooltip';
import styles from './TaskDrawer.module.css';
import { attachTaskInfo } from '../Canvas/utils';
import AddBoxIcon from '@material-ui/icons/AddBox';

function AddSubgraph() {
  return (
    <Tooltip title="Add a subgraph" arrow>
      <span
        role="button"
        tabIndex={0}
        key="addSubgraph"
        className={styles.subgraphButton}
        onDragStart={(event) => {
          attachTaskInfo(event.dataTransfer, {
            task_identifier: 'addSubgraph',
            task_type: 'addSubgraph',
          });
        }}
        draggable
      >
        <AddBoxIcon color="primary" />
        sub
        <div>Workflow</div>
      </span>
    </Tooltip>
  );
}

export default AddSubgraph;
