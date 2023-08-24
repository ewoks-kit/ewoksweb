import Tooltip from '@material-ui/core/Tooltip';
import styles from './TaskDrawer.module.css';
import { attachTaskInfo } from '../Canvas/utils';

function AddSubgraphButton() {
  return (
    <Tooltip title="Add a subgraph" arrow>
      <span
        role="button"
        tabIndex={0}
        key="addNote"
        className={styles.subgraphButton}
        onDragStart={(event) => {
          attachTaskInfo(event.dataTransfer, {
            task_identifier: 'addSubgraph',
            task_type: 'addSubgraph',
          });
        }}
        draggable
      >
        add subgraph
      </span>
    </Tooltip>
  );
}

export default AddSubgraphButton;
