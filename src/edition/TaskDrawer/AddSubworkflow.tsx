import Tooltip from '@material-ui/core/Tooltip';
import styles from './TaskDrawer.module.css';
import { attachTaskInfo } from '../Canvas/utils';
import GrainIcon from '@material-ui/icons/Grain';

function AddSubworkflow() {
  return (
    <Tooltip title="Add a subgworkflow" arrow>
      <span
        role="button"
        tabIndex={0}
        key="addWorkflow"
        className="dndnode subgraph"
        onDragStart={(event) => {
          attachTaskInfo(event.dataTransfer, {
            task_identifier: 'subworkflow',
            task_type: 'subworkflow',
          });
        }}
        draggable
      >
        <GrainIcon color="primary" />
        Add sub-
        <div>Workflow</div>
      </span>
    </Tooltip>
  );
}

export default AddSubworkflow;
