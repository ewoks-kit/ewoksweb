import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import type { EwoksRFNodeData } from '../../../types';
import TaskProperty from './TaskProperty';

import styles from '../EditSidebar.module.css';

interface Props {
  nodeId: string;
  nodeData: EwoksRFNodeData;
  onPropChange: (
    propKeyValue: {
      task_identifier?: string;
    },
    nodeData: EwoksRFNodeData
  ) => void;
}

function NodeInfo(props: Props) {
  const { nodeId, nodeData, onPropChange } = props;

  const isEditable = ['ppfmethod', 'method', 'script'].includes(
    nodeData.task_props.task_type
  );

  return (
    // Commented till it is added on an icon when NodeInfo loose the accordion
    // <SidebarTooltip text="These are properties of the task on which the node is based. They can only be changed by editing the relevant task.">
    <Accordion className={styles.accordion} data-cy="node_info">
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
      >
        <Typography>Node Info</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          <TaskProperty
            editable={isEditable}
            id="task_identifier"
            label="Task Identifier"
            value={nodeData.task_props.task_identifier || ''}
            onPropChange={(propKeyValue) =>
              onPropChange(propKeyValue, nodeData)
            }
          />
          <TaskProperty id="id" label="Id" value={nodeId} />
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
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default NodeInfo;
