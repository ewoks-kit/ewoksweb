import type { ChangeEvent } from 'react';
import { Checkbox, IconButton } from '@material-ui/core';
import DataMappingComponent from '../EditableTableProperties/DataMapping';
import Conditions from '../EditableTableProperties/Conditions';
import SidebarTooltip from '../SidebarTooltip';
import EdgeLabelInput from './EdgeLabelInput';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import type { Edge } from 'reactflow';

import styles from './Details.module.css';
import InputTextField from './InputTextField';
import InfoIcon from '@material-ui/icons/Info';
import sidebarStyle from '../sidebarStyle';

export default function LinkDetails(selectedElement: Edge) {
  const edgeData = useEdgeDataStore((state) =>
    state.edgesData.get(selectedElement.id)
  );

  assertEdgeDataDefined(edgeData, selectedElement.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const requiredChanged = (event: ChangeEvent<HTMLInputElement>) => {
    mergeEdgeData(selectedElement.id, { required: event.target.checked });
  };

  const handleChangeShowDataMapping = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    mergeEdgeData(selectedElement.id, { map_all_data: event.target.checked });
  };

  const handleChangeShowConditions = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    mergeEdgeData(selectedElement.id, { on_error: event.target.checked });
  };

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
        <section>
          <Checkbox
            style={sidebarStyle.checkbox}
            checked={edgeData.map_all_data}
            onChange={handleChangeShowDataMapping}
            inputProps={{ 'aria-label': 'Map all Data' }}
            color="primary"
          />
          <span>Map all Data</span>
        </section>
        <section>
          <Checkbox
            style={sidebarStyle.checkbox}
            checked={edgeData.on_error}
            onChange={handleChangeShowConditions}
            inputProps={{ 'aria-label': 'On Error condition' }}
            color="primary"
          />
          <span>On Error condition</span>
        </section>
        <section>
          <Checkbox
            style={sidebarStyle.checkbox}
            checked={edgeData.required}
            onChange={requiredChanged}
            color="primary"
          />
          <span>Required</span>
        </section>
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
              Sub_target_attributes:
              {edgeData.sub_target_attributes}
            </div>
          )}
        </section>
      </section>
    </>
  );
}
