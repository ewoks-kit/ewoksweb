import type { DataMapping, EwoksRFLink } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import { useNode } from '../../../store/graph-hooks';
import { isClass } from './utils';
import { useReactFlow } from 'reactflow';

export default function DataMappingComponent(element: EwoksRFLink) {
  const { getEdges, setEdges } = useReactFlow();

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const sourceNode = useNode(element.source);
  const targetNode = useNode(element.target);

  function addDataMapping() {
    if (element.data.data_mapping?.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
      return;
    }
    const newEdge = {
      ...element,
      data: {
        ...element.data,
        data_mapping: [
          ...(element.data.data_mapping || []),
          { id: '', name: '', value: '' },
        ],
      },
    };
    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value as string,
      };
    });
    const newEdge = {
      ...element,
      label: dmap
        .map((el) => `${el.source_output || ''}->${el.target_input || ''}`)
        .join(', '),
      data: {
        ...element.data,
        data_mapping: dmap,
      },
    };
    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
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
      {element.data.data_mapping && element.data.data_mapping.length > 0 && (
        <EditableTable
          headers={['Source', 'Target']}
          defaultValues={element.data.data_mapping}
          valuesChanged={dataMappingValuesChanged}
          typeOfValues={[
            {
              type: element.source
                ? isClass(sourceNode)
                  ? 'select'
                  : 'input'
                : 'input',
              values: element.data.links_input_names || [],
            },
            {
              type: element.target
                ? isClass(targetNode)
                  ? 'select'
                  : 'input'
                : 'input',
              values: [
                ...(element.data.links_required_output_names || []),
                ...(element.data.links_optional_output_names || []),
              ],
            },
          ]}
        />
      )}
    </div>
  );
}
