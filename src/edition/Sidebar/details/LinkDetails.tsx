import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
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
import RequiredLinkControl from './RequiredLinkControl';

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
            text={
              'Open the documentation explaining the Advanced fields in a new page'
            }
          >
            <IconButton
              href="https://ewokscore.readthedocs.io/en/stable/reference/specs.html#link-attributes"
              size="small"
              target="_blank"
            >
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
        <RequiredLinkControl
          value={edgeData.required}
          onChange={(checked) =>
            mergeEdgeData(selectedElement.id, { required: checked })
          }
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
