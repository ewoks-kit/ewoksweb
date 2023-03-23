import type { DataMapping, EwoksRFLink, EwoksRFLinkData } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import { useNode } from '../../../store/graph-hooks';
import { isClass } from './utils';
import useEdgeDataStore from '../../../store/useEdgeDataStore';

export default function DataMappingComponent(element: EwoksRFLink) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const sourceNode = useNode(element.source);
  const targetNode = useNode(element.target);

  function addDataMapping() {
    if (edgeData?.data_mapping?.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
      return;
    }

    mergeEdgeData(element.id, {
      data_mapping: [
        ...(edgeData?.data_mapping || []),
        { id: '', name: '', value: '' },
      ],
    } as EwoksRFLinkData);
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value as string,
      };
    });

    setEdgeData(element.id, {
      data_mapping: dmap,
    } as EwoksRFLinkData);
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
        onClick={() => addDataMapping()}
        data-cy="addDataMappingButton"
      >
        <AddCircleOutlineIcon />
      </IconButton>
      {edgeData?.data_mapping && edgeData.data_mapping.length > 0 && (
        <EditableTable
          headers={['Source', 'Target']}
          defaultValues={edgeData.data_mapping}
          valuesChanged={dataMappingValuesChanged}
          typeOfValues={[
            {
              type: element.source
                ? isClass(sourceNode)
                  ? 'select'
                  : 'input'
                : 'input',
              values: edgeData.links_input_names || [],
            },
            {
              type: element.target
                ? isClass(targetNode)
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
