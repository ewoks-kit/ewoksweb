import type { DataMapping, EditableTableRow } from 'types';
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
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  // TODO: specify the source and target of this imaginary link to specify data_mapping
  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.id)
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.id)
  );

  function addDataMapping(rows: EditableTableRow[] | undefined) {
    mergeNodeData(element.id, {
      ewoks_props: {
        default_error_attributes: {
          data_mapping: [
            ...(rows as DataMapping[]),
            { id: nanoid(), name: '', value: '' },
          ],
        },
      },
    });
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        id: row.source_output ? row.source_output.toString() : row.id,
        name: row.name,
        value: row.value,
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
        onRowAdd={(rows) => addDataMapping(rows)}
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
