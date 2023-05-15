import type { DataMapping, EwoksRFNodeData } from 'types';
import { isClass } from './utils';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import type { Node } from 'reactflow';
import TableDataMapping from './TableDataMapping';
import { nanoid } from 'nanoid';

export default function NodeDataMapping(element: Node) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(element.id));
  assertNodeDataDefined(nodeData, element.id);
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  // TODO: specify the source and target of this imaginary link to specify data_mapping
  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.id)
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.id)
  );

  function addDataMapping(nodeDataProp: EwoksRFNodeData) {
    const elMap =
      nodeDataProp.ewoks_props.default_error_attributes?.data_mapping || [];

    const newNodeData = {
      ewoks_props: {
        default_error_attributes: {
          data_mapping: [...elMap, { id: nanoid(), name: '', value: '' }],
        },
      },
    };

    mergeNodeData(element.id, newNodeData);
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
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
    mergeNodeData(element.id, newNodeData);
  };

  return (
    <div>
      <TableDataMapping
        onRowAdd={() => addDataMapping(nodeData)}
        headers={['Source', 'Target']}
        values={
          nodeData.ewoks_props.default_error_attributes?.data_mapping || []
        }
        valuesChanged={dataMappingValuesChanged}
        typeOfValues={[
          {
            type: isClass(sourceNodeData) ? 'select' : 'input',
            values: [], // nodeData.links_input_names || [],
          },
          {
            type: isClass(targetNodeData) ? 'select' : 'input',
            values: [],
            // [
            //   ...(nodeData.links_required_output_names || []),
            //   ...(nodeData.links_optional_output_names || []),
            // ],
          },
        ]}
      />
    </div>
  );
}
