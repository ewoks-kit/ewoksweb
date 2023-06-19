import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import type { EwoksRFNodeData } from '../../../types';
import SidebarTooltip from '../SidebarTooltip';
import EditTaskProp from './EditTaskProp';

import styles from '../EditSidebar.module.css';

interface Props {
  nodeId: string;
  nodeData: EwoksRFNodeData;
  onPropChange: (
    propKeyValue: {
      task_identifier?: string;
      node_icon?: string;
    },
    nodeData: EwoksRFNodeData
  ) => void;
  entryClassName?: string;
}

function NodeInfo(props: Props) {
  const { nodeId, nodeData, entryClassName, onPropChange } = props;

  const editableTaskProperties = [
    {
      id: 'task_identifier',
      label: 'Task identifier',
      value: nodeData.task_props.task_identifier,
    },
    {
      id: 'node_icon',
      label: 'Icon',
      value: nodeData.ui_props.icon || 'default',
    },
  ];

  const NonEditableTaskProperties = [
    { id: 'id', label: 'Id', value: nodeId },
    {
      id: 'task_type',
      label: 'Type',
      value: nodeData.task_props.task_type,
    },
    {
      id: 'task_generator',
      label: 'Generator',
      value: nodeData.ewoks_props.task_generator || 'None',
    },
    {
      id: 'task_category',
      label: 'Category',
      value: nodeData.task_props.task_category || 'No category',
    },
    {
      id: 'required_input_names',
      label: 'Required inputs',
      value: nodeData.task_props.required_input_names || 'None',
    },
    {
      id: 'optional_input_names',
      label: 'Optional inputs',
      value: nodeData.task_props.optional_input_names || 'None',
    },
    {
      id: 'output_names',
      label: 'Outputs',
      value: nodeData.task_props.output_names || 'None',
    },
  ];

  return (
    <SidebarTooltip text="These are properties of the task on which the node is based. They can only be changed by editing the relevant task.">
      <Accordion className={styles.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
        >
          <Typography>Node Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: '100%' }}>
            {editableTaskProperties.map(({ id, label, value }) =>
              ['ppfmethod', 'method', 'script'].includes(
                nodeData.task_props.task_type
              ) ? (
                <EditTaskProp
                  key={id}
                  id={id}
                  label={label}
                  value={value || ''}
                  propChanged={(propKeyValue) =>
                    onPropChange(propKeyValue, nodeData)
                  }
                  editProps
                />
              ) : (
                <div key={id} className={entryClassName}>
                  <b>{label}:</b> {value}
                </div>
              )
            )}
            {NonEditableTaskProperties.map(({ id, label, value }) => (
              <div key={id} className={entryClassName}>
                <b>{label}:</b>{' '}
                {Array.isArray(value) ? value.join(', ') : value}
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </SidebarTooltip>
  );
}

export default NodeInfo;
