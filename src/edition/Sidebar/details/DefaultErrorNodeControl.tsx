import { Checkbox, Grid, Switch, Typography } from '@material-ui/core';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { DEFAULT_NODE_VALUES } from '../../../utils/defaultValues';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import NodeDataMapping from '../EditableTableProperties/NodeDataMapping';
import sidebarStyle from '../sidebarStyle';

export default function DefaultErrorNodeControl(props: { nodeId: string }) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);
  const { default_error_node, default_error_attributes } = nodeData.ewoks_props;

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  function handleDefaultErrorNodeChanged(checked: boolean) {
    mergeNodeData(nodeId, {
      ewoks_props: {
        default_error_node: checked,
      },
    });
  }

  const handleChangeShowDataMapping = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    mergeNodeData(nodeId, {
      ewoks_props: {
        default_error_attributes: { map_all_data: !event.target.checked },
      },
    });
  };

  return (
    <>
      <section>
        <Checkbox
          style={sidebarStyle.checkbox}
          checked={default_error_node || DEFAULT_NODE_VALUES.default_error_node}
          onChange={(event) =>
            handleDefaultErrorNodeChanged(event.target.checked)
          }
          inputProps={{ 'aria-label': 'controlled' }}
          color="primary"
        />
        <span>Default Error Node</span>
      </section>

      {default_error_node && (
        <section>
          <Typography component="div" style={{ fontSize: '15px' }}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>
                {default_error_attributes?.map_all_data ? (
                  <b>Map all data</b>
                ) : (
                  'Map all data'
                )}
              </Grid>
              <Grid item>
                <Switch
                  checked={!default_error_attributes?.map_all_data}
                  onChange={handleChangeShowDataMapping}
                  name="dataMappingSwitch"
                  color="primary"
                />
              </Grid>
              <Grid item>
                {!default_error_attributes?.map_all_data ? (
                  <b>Data Mapping</b>
                ) : (
                  'Data Mapping'
                )}
              </Grid>
            </Grid>
          </Typography>
        </section>
      )}
      {default_error_node && !default_error_attributes?.map_all_data && (
        <section>
          <NodeDataMapping nodeId={nodeId} />
        </section>
      )}
    </>
  );
}
