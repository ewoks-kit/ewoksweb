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

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  const [defaultErrorNode, setDefaultErrorNode] = useState(false);

  const [showDataMapping, setShowDataMapping] = useState(
    !nodeData.ewoks_props.default_error_attributes?.map_all_data
  );

  useEffect(() => {
    setDefaultErrorNode(nodeData.ewoks_props.default_error_node || false);
  }, [nodeData]);

  function defaultErrorNodeChanged(checked: boolean) {
    mergeNodeData(selectedElement.id, {
      ewoks_props: {
        default_error_node: checked,
      },
    });
  }

  const handleChangeShowDataMapping = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowDataMapping(event.target.checked);
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
            checked={defaultErrorNode}
            onChange={(event) => defaultErrorNodeChanged(event.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
            color="primary"
          />
          <b>Default Error Node</b>
        </div>
      </SidebarTooltip>

      {defaultErrorNode && (
        <div>
          <Typography component="div" style={{ fontSize: '15px' }}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>
                {!showDataMapping ? <b>Map all data</b> : 'Map all data'}
              </Grid>
              <Grid item>
                <Switch
                  checked={showDataMapping}
                  onChange={handleChangeShowDataMapping}
                  name="dataMappingSwitch"
                />
              </Grid>
              <Grid item>
                {showDataMapping ? <b>Data Mapping</b> : 'Data Mapping'}
              </Grid>
            </Grid>
          </Typography>
        </div>
      )}
      {defaultErrorNode && showDataMapping && (
        <div>
          <NodeDataMapping {...selectedElement} />
        </div>
      )}
    </>
  );
}
