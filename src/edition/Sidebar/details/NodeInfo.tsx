import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';

import type { NodeData } from '../../../types';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import TaskIdentifier from './TaskIdentifier';
import TaskProperty from './TaskProperty';

interface Props {
  nodeId: string;
  nodeData: NodeData;
  onTaskIdChange: (newTaskId: string, nodeData: NodeData) => void;
}

function NodeInfo(props: Props) {
  const { nodeId, nodeData, onTaskIdChange } = props;
  const { task_props, ewoks_props } = nodeData;

  return (
    <>
      <h3 style={sidebarStyle.sectionHeader}>
        Task Info
        <SidebarTooltip
          text="These are properties of the task on which the node
      is based. They can only be changed by editing the relevant task except
      the task identifier which appoints another task to the node"
        >
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </SidebarTooltip>
      </h3>
      <TaskIdentifier nodeData={nodeData} onTaskIdChange={onTaskIdChange} />
      <TaskProperty label="Node Id" value={nodeId} />
      <TaskProperty label="Task Type" value={nodeData.task_props.task_type} />
      {ewoks_props.task_generator && (
        <TaskProperty label="Generator" value={ewoks_props.task_generator} />
      )}
      {task_props.task_category && (
        <TaskProperty label="Category" value={task_props.task_category} />
      )}
      <TaskProperty
        label="Required Inputs"
        value={task_props.required_input_names ?? []}
      />
      {task_props.optional_input_names && (
        <TaskProperty
          label="Optional Inputs"
          value={task_props.optional_input_names}
        />
      )}
      <TaskProperty
        label="Outputs"
        value={nodeData.task_props.output_names ?? []}
      />
    </>
  );
}

export default NodeInfo;
