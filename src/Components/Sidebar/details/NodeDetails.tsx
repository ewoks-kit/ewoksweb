import { useEffect, useState } from 'react';
import type {
  DataMapping,
  EditableTableRow,
  EwoksRFNodeData,
} from '../../../types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  IconButton,
  Typography,
} from '@material-ui/core';
import EditTaskProp from './EditTaskProp';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import SidebarTooltip from '../SidebarTooltip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NodeLabelComment from './NodeLabelComment';
import DefaultInputs from '../EditableTableProperties/DefaultInputs';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../../store/useNodeDataStore';
import {
  assertNodeDataDefined,
  assertNodeDefined,
} from '../../../utils/typeGuards';
import { useNodesIds } from '../../../store/graph-hooks';
import type { Node } from 'reactflow';
import TableDataMapping from '../EditableTableProperties/TableDataMapping';

// DOC: selectedNode details in sidebar
export default function NodeDetails(selectedElement: Node) {
  const classes = useDashboardStyles();

  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id)
  );
  assertNodeDataDefined(nodeData, selectedElement.id);

  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const nodesIds = useNodesIds();

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const [inputsComplete, setInputsComplete] = useState<boolean>(false);
  const [defaultErrorNode, setDefaultErrorNode] = useState<boolean>(false);
  const [dataMapping, setDataMapping] = useState<DataMapping[]>([]);
  const [mapAllData, setMapAllData] = useState<boolean>(false);

  const NonEditableTaskProperties = [
    { id: 'id', label: 'Id', value: selectedElement.id },
    {
      id: 'task_type',
      label: 'Type',
      value: nodeData.task_props.task_type || '',
    },
    {
      id: 'task_generator',
      label: 'Generator',
      value: nodeData.ewoks_props.task_generator || '',
    },
    {
      id: 'task_category',
      label: 'Category',
      value: nodeData.task_props.task_category || '',
    },
    {
      id: 'optional_input_names',
      label: 'Optional Inputs',
      value: nodeData.task_props.optional_input_names || [],
    },
    {
      id: 'required_input_names',
      label: 'Required Inputs',
      value: nodeData.task_props.required_input_names || [],
    },
    {
      id: 'output_names',
      label: 'Outputs',
      value: nodeData.task_props.output_names || [],
    },
  ];

  const editableTaskProperties = [
    {
      id: 'task_identifier',
      label: 'Task identifier',
      value: nodeData.task_props.task_identifier || '',
    },
    {
      id: 'node_icon',
      label: 'Icon',
      value: nodeData.ui_props.icon || 'default',
    },
  ];

  useEffect(() => {
    setInputsComplete(nodeData.ewoks_props.inputs_complete || false);
    setDefaultErrorNode(nodeData.ewoks_props.default_error_node || false);

    setDataMapping(
      nodeData.ewoks_props.default_error_attributes?.data_mapping || []
    );
    setMapAllData(
      nodeData.ewoks_props.default_error_attributes?.map_all_data || false
    );
  }, [nodeData]);

  function propChanged(
    propKeyValue: {
      task_identifier?: string;
      node_icon?: string;
    },
    nodeDataL: EwoksRFNodeData
  ) {
    // DOC: if the task_identifier changes (ppfmethod, ppfport, script case) then the id
    // of the node needs to change for a coherent json. Links to/from this node also change!
    if (Object.keys(propKeyValue)[0] === 'task_identifier') {
      // DOC: find unique id based on new task_identifier
      let uniqueId = Object.values(propKeyValue)[0];
      let id = 0;
      // TODO not use nodesData to calculate new id
      // IMP TODO: by also changinh the id of a node we make the previous one disappear and
      // assertDefined where the old id is used complains. Solution
      while (nodesIds.some((nodeId) => nodeId === uniqueId)) {
        uniqueId += id++;
      }

      const newNode = getNodes().find((nod) => nod.id === selectedElement.id);
      assertNodeDefined(newNode, selectedElement.id);

      newNode.id = uniqueId;

      const newLinks = getEdges().map((link) => {
        if (link.source === selectedElement.id) {
          return {
            ...link,
            source: uniqueId,
          };
        }

        if (link.target === selectedElement.id) {
          return {
            ...link,
            target: uniqueId,
          };
        }

        return link;
      });

      setNodeData(uniqueId, {
        ...nodeDataL,
        task_props: {
          ...nodeDataL.task_props,
          task_identifier: propKeyValue.task_identifier || '',
        },
      });

      setNodes([
        ...getNodes().filter((nod) => nod.id !== selectedElement.id),
        newNode,
      ]);
      setEdges(newLinks);

      return;
    }

    if (Object.keys(propKeyValue)[0] === 'node_icon') {
      mergeNodeData(selectedElement.id, {
        ui_props: { icon: Object.values(propKeyValue)[0] },
      });
    }
  }

  function inputsCompleteChanged(checked: boolean) {
    mergeNodeData(selectedElement.id, {
      ewoks_props: {
        inputs_complete: checked,
      },
    });
  }

  function defaulErrortNodeChanged(checked: boolean) {
    mergeNodeData(selectedElement.id, {
      ewoks_props: {
        default_error_node: checked,
      },
    });
  }

  function addDataMapping(nodeDataProp: EwoksRFNodeData) {
    const elMap =
      nodeDataProp.ewoks_props.default_error_attributes?.data_mapping || [];

    if (!elMap.some((x) => x.id === '')) {
      const newNodeData = {
        ewoks_props: {
          default_error_attributes: {
            data_mapping: [...elMap, { id: '', name: '', value: '' }],
          },
        },
      };
      mergeNodeData(selectedElement.id, newNodeData);
    }
  }

  function dataMappingValuesChanged(table: EditableTableRow[]) {
    const dmap: DataMapping[] = table.map((row) => {
      if (typeof row.value !== 'string') {
        throw new TypeError(
          'Expecting only string but got another type for Data_Mapping'
        );
      }
      return {
        source_output: row.name,
        target_input: row.value,
      };
    });
    const newNodeData = {
      ewoks_props: {
        default_error_attributes: {
          data_mapping: dmap,
        },
      },
    };
    mergeNodeData(selectedElement.id, newNodeData);
  }

  function mapAllDataChanged(checked: boolean) {
    const newNodeData = {
      ewoks_props: {
        default_error_attributes: {
          map_all_data: checked,
        },
      },
    };
    mergeNodeData(selectedElement.id, newNodeData);
  }

  return (
    <Box>
      <NodeLabelComment showComment selectedElement={selectedElement} />
      <DefaultInputs {...selectedElement} />

      <SidebarTooltip
        text={`Set to True when the default input covers all required input
              (used for method and script as the required inputs are unknown).`}
      >
        <div>
          <b>Inputs Complete</b>
          <Checkbox
            checked={inputsComplete}
            onChange={(event) => inputsCompleteChanged(event.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
      </SidebarTooltip>

      <SidebarTooltip
        text={`When set to True all nodes without error handler
              will be linked to this node. ONLY for one node in its graph`}
      >
        <div>
          <b>Default Error Node</b>
          <Checkbox
            checked={defaultErrorNode}
            onChange={(event) => defaulErrortNodeChanged(event.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
      </SidebarTooltip>

      {defaultErrorNode && (
        <div>
          <b>Map all data</b>
          <Checkbox
            checked={mapAllData}
            onChange={(event) => mapAllDataChanged(event.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
      )}
      {defaultErrorNode && !mapAllData && (
        <div>
          <b>Data Mapping </b>
          <IconButton
            style={{ padding: '1px' }}
            aria-label="delete"
            onClick={() => addDataMapping(nodeData)}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          {dataMapping.length > 0 && (
            <TableDataMapping
              headers={['Source', 'Target']}
              defaultValues={dataMapping}
              valuesChanged={dataMappingValuesChanged}
              typeOfValues={[
                {
                  type: 'input',
                  values: [],
                },
                {
                  type: 'input',
                  values: [],
                },
              ]}
            />
          )}
        </div>
      )}

      <SidebarTooltip
        text={`These properties are being populated by the task the
        specific node is based on. If you need to have them create a new Task
        with the appropriate properties and use it.`}
      >
        <Accordion className="Accordions-sidebar">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>Node Info</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ width: '100%' }}>
              {editableTaskProperties.map(({ id, label, value }) =>
                ['ppfmethod', 'method', 'script'].includes(
                  nodeData.task_props.task_type || ''
                ) ? (
                  <EditTaskProp
                    key={id}
                    id={id}
                    label={label}
                    value={value || ''}
                    propChanged={(propKeyValue) =>
                      propChanged(propKeyValue, nodeData)
                    }
                    editProps
                  />
                ) : (
                  <div key={id} className={classes.detailsLabels}>
                    <b>{label}:</b> {value}
                  </div>
                )
              )}
              {NonEditableTaskProperties.map(({ id, label, value }) => (
                <div key={id} className={classes.detailsLabels}>
                  <b>{label}:</b>{' '}
                  {typeof value === 'object' ? value.join(', ') : value}
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      </SidebarTooltip>
    </Box>
  );
}
