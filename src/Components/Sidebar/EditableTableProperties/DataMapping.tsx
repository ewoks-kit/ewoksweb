import type { DataMapping, EwoksRFLink, EwoksRFLinkData } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import { isClass } from './utils';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import { getEdgeData } from '../../../utils';

export default function DataMappingComponent(element: EwoksRFLink) {
  const edgeData = getEdgeData(element.id);
  assertEdgeDataDefined(edgeData, element.id);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.source)
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.target)
  );

  function addDataMapping(edgeDataC: EwoksRFLinkData) {
    if (edgeDataC.data_mapping?.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
      return;
    }

    mergeEdgeData(element.id, {
      data_mapping: [
        ...(edgeDataC.data_mapping || []),
        { id: '', name: '', value: '' },
      ],
    });
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value as string,
      };
    });

    mergeEdgeData(element.id, {
      data_mapping: dmap,
    });
  };

  return (
    <div>
      <SidebarTooltip
        text={`Describes the data transfer from source output to
          target input arguments.`}
      >
        <b>Data Mapping </b>
      </SidebarTooltip>

      <IconButton
        style={{ padding: '1px' }}
        aria-label="dataMapping"
        onClick={() => addDataMapping(edgeData)}
        data-cy="addDataMappingButton"
      >
        <AddCircleOutlineIcon />
      </IconButton>
      {edgeData.data_mapping && edgeData.data_mapping.length > 0 && (
        <EditableTable
          headers={['Source', 'Target']}
          defaultValues={edgeData.data_mapping}
          valuesChanged={dataMappingValuesChanged}
          typeOfValues={[
            {
              type: element.source
                ? isClass(sourceNodeData)
                  ? 'select'
                  : 'input'
                : 'input',
              values: edgeData.links_input_names || [],
            },
            {
              type: element.target
                ? isClass(targetNodeData)
                  ? 'select'
                  : 'input'
                : 'input',
              values: [
                ...(edgeData.links_required_output_names || []),
                ...(edgeData.links_optional_output_names || []),
              ],
            },
          ]}
        />
      )}
    </div>
  );
}
