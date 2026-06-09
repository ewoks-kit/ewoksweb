import { Switch } from '@mui/material';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { DEFAULT_NODE_VALUES } from '../../../utils/defaultValues';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import SidebarCheckbox from '../SidebarCheckbox';
import NodeDataMapping from '../table/NodeDataMapping';

import styles from './DefaultErrorNodeControl.module.css';

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
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    mergeNodeData(nodeId, {
      ewoks_props: {
        default_error_attributes: { map_all_data: !event.target.checked },
      },
    });
  };

  const mapAllData = !!default_error_attributes?.map_all_data;

  return (
    <>
      <SidebarCheckbox
        value={default_error_node || DEFAULT_NODE_VALUES.default_error_node}
        onChange={handleDefaultErrorNodeChanged}
        label="Default Error Node"
      />

      {default_error_node && (
        <section>
          <div className={styles.container}>
            <span className={styles.mapAllDataLabel} data-selected={mapAllData}>
              Map all data
            </span>
            <Switch
              checked={!mapAllData}
              onChange={handleChangeShowDataMapping}
              name="dataMappingSwitch"
              color="primary"
            />
            <span
              className={styles.dataMappingLabel}
              data-selected={!mapAllData}
            >
              Data Mapping
            </span>
          </div>
          {!mapAllData && <NodeDataMapping nodeId={nodeId} />}
        </section>
      )}
    </>
  );
}
