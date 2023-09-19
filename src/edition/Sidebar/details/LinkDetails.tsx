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

export default function LinkDetails(selectedElement: Edge) {
  const edgeData = useEdgeDataStore((state) =>
    state.edgesData.get(selectedElement.id)
  );

  assertEdgeDataDefined(edgeData, selectedElement.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  // const [showConditions, setShowConditions] = useState(!edgeData.map_all_data);

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

  const checboxStyle = { padding: '2px 1px 2px 8px' };

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

      <div style={{ marginTop: '15px', fontSize: '16px' }}>
        <b>Data Mapping</b>
        <SidebarTooltip text="Map data between outputs of source node and inputs of target node">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </SidebarTooltip>
      </div>
      <div>
        <DataMappingComponent
          element={selectedElement}
          mapAllData={edgeData.map_all_data}
        />
      </div>
      <div style={{ marginTop: '15px', fontSize: '16px' }}>
        <b>Conditions</b>
        <SidebarTooltip text="Map data between outputs of source node and inputs of target node">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </SidebarTooltip>
      </div>
      <div>
        <Conditions element={selectedElement} onError={edgeData.on_error} />
      </div>
      <div style={{ marginTop: '15px', fontSize: '16px' }}>
        <b>Advanced</b>
        <SidebarTooltip
          text={`--Map all Data: Setting this to True is
          equivalent to Data Mapping
          being the identity mapping for all input names.
          Cannot be used in combination with data_mapping.
          --On Error condition: A special condition where
          the task raises an exception.
          Cannot be used in combination with conditions.`}
        >
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </SidebarTooltip>
      </div>
      <div>
        {/* A tip for the required also. Should that be all in advanced tooltip? */}
        <div>
          <Checkbox
            style={checboxStyle}
            checked={edgeData.required}
            onChange={requiredChanged}
            color="primary"
          />
          <span>Required</span>
        </div>
        <div>
          <Checkbox
            style={checboxStyle}
            checked={edgeData.map_all_data}
            onChange={handleChangeShowDataMapping}
            inputProps={{ 'aria-label': 'controlled' }}
            color="primary"
          />
          <span>Map all Data</span>
        </div>
        <div>
          <Checkbox
            style={checboxStyle}
            checked={edgeData.on_error}
            onChange={handleChangeShowConditions}
            inputProps={{ 'aria-label': 'controlled' }}
            color="primary"
          />
          <span>On Error condition</span>
        </div>
        <div className={styles.entry}>
          <b>Source:</b> {selectedElement.source}
        </div>
        <div className={styles.entry}>
          <b>Target:</b> {selectedElement.target}
        </div>
        {edgeData.sub_target && (
          <div className={styles.entry}>
            <b>Sub_target:</b> {edgeData.sub_target}
          </div>
        )}
        {edgeData.sub_target_attributes && (
          <div className={styles.entry}>
            <b>Sub_target_attributes:</b>
            {edgeData.sub_target_attributes}
          </div>
        )}
      </div>
    </>
  );
}
