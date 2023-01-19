import type { DataMapping, EwoksRFLink } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';

export default function DataMappingComponent(element: EwoksRFLink) {
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const graphRF = useStore((state) => state.graphRF);

  function addDataMapping() {
    if (element.data?.data_mapping?.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
      return;
    }

    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          data_mapping: [
            ...(element.data?.data_mapping || []),
            { id: '', name: '', value: '' },
          ],
        },
      },
      'fromSaveElement'
    );
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value as string,
      };
    });
    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          data_mapping: dmap,
          label: dmap
            .map((el) => `${el.source_output || ''}->${el.target_input || ''}`)
            .join(', '),
        },
      },
      'fromSaveElement'
    );
  };

  function isClassSource(): boolean {
    const sourceNode = graphRF.nodes.find((nod) => {
      return nod.id === element.source;
    });
    if (sourceNode) {
      return sourceNode.task_type === 'class';
    }
    return false;
  }

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
      {element.data.data_mapping && element.data.data_mapping.length > 0 && (
        <EditableTable
          headers={['Source', 'Target']}
          defaultValues={element.data.data_mapping}
          valuesChanged={dataMappingValuesChanged}
          typeOfValues={[
            {
              type: element.source
                ? isClassSource()
                  ? 'select'
                  : 'input'
                : 'input',
              values: element.data.links_input_names || [],
            },
            {
              type: element.target
                ? ['class'].includes(
                    graphRF?.nodes?.[0] &&
                      graphRF.nodes.find((nod) => {
                        return nod.id === element.target;
                      }).task_type
                  )
                  ? 'select'
                  : 'input'
                : 'input',
              values: [
                ...element.data.links_required_output_names,
                ...element.data.links_optional_output_names,
              ],
            },
          ]}
        />
      )}
    </div>
  );
}
