import { useEffect, useState } from 'react';
import type {
  DataMapping,
  EditableTableRow,
  EwoksRFNode,
} from '../../../types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from '../EditableTableProperties/EditableTable';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import EditTaskProp from './EditTaskProp';
import DashboardStyle from '../../Dashboard/DashboardStyle';
import useStore from '../../../store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import { OpenInBrowser } from '@material-ui/icons';
import LabelComment from './LabelComment';
import DefaultInputs from '../EditableTableProperties/DefaultInputs';
import useConfigStore from '../../../store/useConfigStore';
import AdvancedDetailsCheckbox from './AdvancedDetailsCheckbox';

const useStyles = DashboardStyle;

// DOC: selectedNode details in sidebar
export default function NodeDetails(element: EwoksRFNode) {
  const classes = useStyles();

  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const showAdvancedDetails = useConfigStore(
    (state) => state.showAdvancedDetails
  );

  const [inputsComplete, setInputsComplete] = useState<boolean>(false);
  const [defaultErrorNode, setDefaultErrorNode] = useState<boolean>(false);
  const [dataMapping, setDataMapping] = useState<DataMapping[]>([]);
  const [mapAllData, setMapAllData] = useState<boolean>(false);

  const NonEditableTaskProperties = [
    { id: 'id', label: 'Id', value: element.id },
    { id: 'task_type', label: 'Type', value: element.task_type },
    {
      id: 'task_generator',
      label: 'Generator',
      value: element.task_generator,
    },
    {
      id: 'task_category',
      label: 'Category',
      value: element.task_category,
    },
    {
      id: 'optional_input_names',
      label: 'Optional Inputs',
      value: element.optional_input_names,
    },
    {
      id: 'required_input_names',
      label: 'Required Inputs',
      value: element.required_input_names,
    },
    {
      id: 'output_names',
      label: 'Outputs',
      value: element.output_names,
    },
  ];

  const editableTaskProperties = [
    {
      id: 'task_identifier',
      label: 'Identifier',
      value: element.task_identifier,
    },
    { id: 'node_icon', label: 'Icon', value: element.data.icon },
  ];

  useEffect(() => {
    setInputsComplete(!!element.inputs_complete);
    setDefaultErrorNode(element.default_error_node || false);
    setDataMapping(element.default_error_attributes?.data_mapping || []);
    setMapAllData(element.default_error_attributes?.map_all_data || false);
  }, [element]);

  function propChanged(propKeyValue: {
    task_identifier?: string;
    node_icon?: string;
  }) {
    // DOC: if the task_identifier changes (ppfmethod, ppfport, script case) then the id
    // of the node needs to change for a coherent json.
    // All links to this node also change source and/or target!
    if (Object.keys(propKeyValue)[0] === 'task_identifier') {
      // DOC: find unique id based on new task_identifier

      let uniqueId = Object.values(propKeyValue)[0];
      let id = 0;
      while (graphRF.nodes.some((nod) => nod.id === uniqueId)) {
        uniqueId += id++;
      }

      const newElement = {
        ...element,
        ...propKeyValue,
        id: uniqueId,
      };

      const newLinks = graphRF.links.map((link) => {
        if (link.source === element.id) {
          return {
            ...link,
            source: uniqueId,
          };
        }

        if (link.target === element.id) {
          return {
            ...link,
            target: uniqueId,
          };
        }

        return link;
      });

      setGraphRF({
        graph: graphRF.graph,
        links: newLinks,
        nodes: [
          ...graphRF.nodes.filter((nod) => nod.id !== element.id),
          newElement,
        ],
      });

      setSelectedElement(newElement, 'fromSaveElement');
      return;
    }

    if (Object.keys(propKeyValue)[0] === 'node_icon') {
      setSelectedElement(
        {
          ...element,
          data: { ...element.data, icon: Object.values(propKeyValue)[0] },
        },
        'fromSaveElement'
      );
    }
  }

  function inputsCompleteChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedElement(
      {
        ...element,
        inputs_complete: event.target.checked,
      },
      'fromSaveElement'
    );
  }

  function defaulErrortNodeChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedElement(
      {
        ...element,
        default_error_node: event.target.checked,
      },
      'fromSaveElement'
    );
  }

  function addDataMapping() {
    const elMap = element.default_error_attributes?.data_mapping || [];

    if (!elMap.some((x) => x.id === '')) {
      setSelectedElement(
        {
          ...element,
          default_error_attributes: {
            ...element.default_error_attributes,
            data_mapping: [...elMap, { id: '', name: '', value: '' }],
          },
        },
        'fromSaveElement'
      );
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
    setSelectedElement(
      {
        ...element,
        default_error_attributes: {
          ...element.default_error_attributes,
          data_mapping: dmap,
        },
      },
      'fromSaveElement'
    );
  }

  function mapAllDataChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedElement(
      {
        ...element,
        default_error_attributes: {
          ...element.default_error_attributes,
          map_all_data: event.target.checked,
        },
      },
      'fromSaveElement'
    );
  }

  return (
    <Box>
      <Paper className={classes.nodeDetails}>
        <LabelComment element={element} showComment={showAdvancedDetails} />
        <DefaultInputs {...element} />

        <hr style={{ color: '#96a5f9' }} />
        <AdvancedDetailsCheckbox />
        {showAdvancedDetails && (
          <>
            <SidebarTooltip
              text={`Set to True when the default input covers all required input
              (used for method and script as the required inputs are unknown).`}
            >
              <div>
                <b>Inputs-complete</b>
                <Checkbox
                  checked={inputsComplete}
                  onChange={inputsCompleteChanged}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </SidebarTooltip>

            <hr style={{ color: '#96a5f9' }} />
            <SidebarTooltip
              text={`When set to True all nodes without error handler
              will be linked to this node. ONLY for one node in its graph`}
            >
              <div>
                <b>Default Error Node</b>
                <Checkbox
                  checked={defaultErrorNode}
                  onChange={defaulErrortNodeChanged}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </SidebarTooltip>
          </>
        )}
        {defaultErrorNode && showAdvancedDetails && (
          <div>
            <b>Map all Data</b>
            <Checkbox
              checked={mapAllData}
              onChange={mapAllDataChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        )}
        {defaultErrorNode && !mapAllData && showAdvancedDetails && (
          <div>
            {/* TODO: Check and Replace Data Mapping with the component to have dropdowns if not rarely used */}
            {/* <DataMappingComponent {...element} /> */}
            <b>Data Mapping </b>
            <IconButton
              style={{ padding: '1px' }}
              aria-label="delete"
              onClick={() => addDataMapping()}
            >
              <AddCircleOutlineIcon />
            </IconButton>
            {dataMapping && dataMapping.length > 0 && (
              <EditableTable
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
        {showAdvancedDetails && (
          <SidebarTooltip
            text={`These properties are being populated by the task the
        specific node is based on. If you need to have them create a new Task
        with the appropriate properties and use it.`}
          >
            <Accordion className="Accordions-sidebar">
              <AccordionSummary
                expandIcon={<OpenInBrowser />}
                aria-controls="panel1a-content"
              >
                <Typography>Node Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ width: '100%' }}>
                  {editableTaskProperties.map(({ id, label, value }) =>
                    ['ppfmethod', 'method', 'script'].includes(
                      element.task_type
                    ) ? (
                      <EditTaskProp
                        key={id}
                        id={id}
                        label={label}
                        value={value || ''}
                        propChanged={propChanged}
                        editProps // editProps
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
        )}
      </Paper>
    </Box>
  );
}
