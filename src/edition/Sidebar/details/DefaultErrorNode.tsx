import { useEffect, useState } from 'react';
import { Checkbox, Grid, Switch, Typography } from '@material-ui/core';
import SidebarTooltip from '../SidebarTooltip';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import type { Node } from 'reactflow';
import NodeDataMapping from '../EditableTableProperties/NodeDataMapping';

// DOC: selectedNode details in sidebar
export default function DefaultErrorNode(selectedElement: Node) {
  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id)
  );
  assertNodeDataDefined(nodeData, selectedElement.id);
  const { default_error_node, default_error_attributes } = nodeData.ewoks_props;

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  function handleDefaultErrorNodeChanged(checked: boolean) {
    mergeNodeData(selectedElement.id, {
      ewoks_props: {
        default_error_node: checked,
      },
    });
  }

  const handleChangeShowDataMapping = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    mergeNodeData(selectedElement.id, {
      ewoks_props: {
        default_error_attributes: { map_all_data: !event.target.checked },
      },
    });
  };

  return (
    <>
      <SidebarTooltip
        text={`When set to True all nodes without error handler
              will be linked to this node. ONLY for one node in its graph`}
      >
        <div>
          <Checkbox
            checked={default_error_node}
            onChange={(event) =>
              handleDefaultErrorNodeChanged(event.target.checked)
            }
            inputProps={{ 'aria-label': 'controlled' }}
            color="primary"
          />
          <b>Default Error Node</b>
        </div>
      </SidebarTooltip>

      {default_error_node && (
        <div>
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
        </div>
      )}
      {default_error_node && !default_error_attributes?.map_all_data && (
        <div>
          <NodeDataMapping {...selectedElement} />
        </div>
      )}
    </>
  );
}
