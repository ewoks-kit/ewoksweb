import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';

import type { EwoksRFNodeData } from '../../../types';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import TaskProperty from './TaskProperty';

interface Props {
  nodeId: string;
  nodeData: EwoksRFNodeData;
  onPropChange: (
    propKeyValue: {
      task_identifier?: string;
    },
    nodeData: EwoksRFNodeData,
  ) => void;
}

function NodeInfo(props: Props) {
  const { nodeId, nodeData, onPropChange } = props;

  const isEditable = ['ppfmethod', 'method', 'script'].includes(
    nodeData.task_props.task_type,
  );

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
      <TaskProperty
        editable={isEditable}
        id="task_identifier"
        label="Task Identifier"
        value={nodeData.task_props.task_identifier || ''}
        onPropChange={(propKeyValue) => onPropChange(propKeyValue, nodeData)}
      />
      <TaskProperty id="id" label="Node Id" value={nodeId} />
      <TaskProperty
        id="task_type"
        label="Task Type"
        value={nodeData.task_props.task_type}
      />
      <TaskProperty
        id="task_generator"
        label="Generator"
        value={nodeData.ewoks_props.task_generator}
      />
      <TaskProperty
        id="task_category"
        label="Category"
        value={nodeData.task_props.task_category}
      />
      <TaskProperty
        id="inputs"
        label="Inputs"
        value={[
          ...(nodeData.task_props.required_input_names ?? []),
          ...(nodeData.task_props.optional_input_names ?? []),
        ]}
      />
      <TaskProperty
        id="outputs"
        label="Outputs"
        value={nodeData.task_props.output_names}
      />
    </>
  );
}

export default NodeInfo;
