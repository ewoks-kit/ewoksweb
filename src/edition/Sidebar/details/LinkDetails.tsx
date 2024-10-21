import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import type { Edge } from '@xyflow/react';

import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import SidebarCheckbox from '../SidebarCheckbox';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import Conditions from '../table/Conditions';
import DataMappingComponent from '../table/DataMapping';
import styles from './Details.module.css';
import EdgeLabelInput from './EdgeLabelInput';
import InputTextField from './InputTextField';

export default function LinkDetails(selectedElement: Edge) {
  const edgeData = useEdgeDataStore((state) =>
    state.edgesData.get(selectedElement.id),
  );

  assertEdgeDataDefined(edgeData, selectedElement.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  return (
    <>
      <EdgeLabelInput element={selectedElement} />
      <InputTextField
        label="Comment"
        defaultValue={edgeData.comment}
        onValueSave={(newComment) => {
          mergeEdgeData(selectedElement.id, { comment: newComment });
        }}
      />
      <section>
        <h3 style={sidebarStyle.sectionHeader}>
          Data Mapping
          <SidebarTooltip text="Map data between outputs of source node and inputs of target node">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </SidebarTooltip>
        </h3>
        <DataMappingComponent
          element={selectedElement}
          mapAllData={edgeData.map_all_data}
        />
      </section>
      <section>
        <h3 style={sidebarStyle.sectionHeader}>
          Conditions
          <SidebarTooltip text="Map data between outputs of source node and inputs of target node">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </SidebarTooltip>
        </h3>
        <Conditions
          element={selectedElement}
          isOnErrorSelected={edgeData.on_error}
        />
      </section>
      <section>
        <h3 style={sidebarStyle.sectionHeader}>
          Advanced
          <SidebarTooltip
            text={`-- Required: setting this to True marks the link as required.
          When a target receives multiple links, it will be executed
          (perhaps multiple times) when all the sources connected to the target
          with required links have been executed. A link is required when it is
          either “marked as required” (link attribute required=True) or
          “unconditional and all ancestors of the source node are required”.
          -- Map all Data: Setting this to True is
          equivalent to Data Mapping
          being the identity mapping for all input names.
          Cannot be used in combination with data_mapping.
          -- On Error condition: A special condition where
          the task raises an exception.
          Cannot be used in combination with conditions.`}
          >
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </SidebarTooltip>
        </h3>
        <SidebarCheckbox
          value={edgeData.map_all_data || false}
          onChange={(checked) =>
            mergeEdgeData(selectedElement.id, { map_all_data: checked })
          }
          label="Map all Data"
        />
        <SidebarCheckbox
          value={edgeData.on_error}
          onChange={(checked) =>
            mergeEdgeData(selectedElement.id, { on_error: checked })
          }
          label="On Error condition"
        />
        <SidebarCheckbox
          value={edgeData.required}
          onChange={(checked) =>
            mergeEdgeData(selectedElement.id, { required: checked })
          }
          label="Required"
        />
        <section>
          <h3 style={sidebarStyle.sectionHeader}>Link properties</h3>
          <div className={styles.entry}>Source: {selectedElement.source}</div>
          <div className={styles.entry}>Target: {selectedElement.target}</div>
          {edgeData.sub_target && (
            <div className={styles.entry}>
              Sub_target: {edgeData.sub_target}
            </div>
          )}
          {edgeData.sub_target_attributes && (
            <div className={styles.entry}>
              Sub_target_attributes:{' '}
              {JSON.stringify(edgeData.sub_target_attributes)}
            </div>
          )}
        </section>
      </section>
    </>
  );
}
