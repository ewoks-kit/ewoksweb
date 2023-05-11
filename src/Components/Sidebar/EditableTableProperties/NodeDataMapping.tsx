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
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  // TODO: specify the source and target of this imaginary link to specify data_mapping
  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.id)
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.id)
  );

  function addDataMapping(nodeDataC: EwoksRFNodeData) {
    setNodeData(element.id, {
      ...nodeDataC,
      ewoks_props: {
        ...nodeDataC.ewoks_props,
        default_error_attributes: {
          ...nodeDataC.ewoks_props.default_error_attributes,
          data_mapping: [
            ...(nodeDataC.ewoks_props.default_error_attributes?.data_mapping ||
              []),
            {
              id: nanoid(),
              name: '',
              value: '',
            },
          ],
        },
      },
    });
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value as string,
      };
    });

    setNodeData(element.id, {
      ...nodeData,
      ewoks_props: {
        ...nodeData.ewoks_props,
        default_error_attributes: {
          ...nodeData.ewoks_props.default_error_attributes,
          data_mapping: dmap,
        },
      },
    });
  };

  return (
    <div>
      <TableDataMapping
        addNewLine={() => addDataMapping(nodeData)}
        headers={['Source', 'Target']}
        defaultValues={
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
