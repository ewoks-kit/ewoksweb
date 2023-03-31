import type { ChangeEvent } from 'react';
import type { EwoksRFLink } from '../../../types';
import { Checkbox, Paper } from '@material-ui/core';
import DashboardStyle from '../../Dashboard/DashboardStyle';
import DataMappingComponent from '../EditableTableProperties/DataMapping';
import Conditions from '../EditableTableProperties/Conditions';
import SidebarTooltip from '../SidebarTooltip';
import LabelComment from './LabelComment';
import { assertEdgeDataDefined, isLink } from '../../../utils/typeGuards';
import useConfigStore from '../../../store/useConfigStore';
import AdvancedDetailsCheckbox from './AdvancedDetailsCheckbox';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { useSelectedElement } from '../../../store/graph-hooks';

const useStyles = DashboardStyle;

export default function LinkDetails() {
  const classes = useStyles();

  const element = useSelectedElement() as EwoksRFLink;
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const showAdvancedDetails = useConfigStore(
    (state) => state.showAdvancedDetails
  );

  const mapAllDataChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    mergeEdgeData(element.id, { map_all_data: event.target.checked });
  };

  function onErrorChanged(event: React.ChangeEvent<HTMLInputElement>) {
    mergeEdgeData(element.id, { on_error: event.target.checked });
  }

  const requiredChanged = (event: ChangeEvent<HTMLInputElement>) => {
    mergeEdgeData(element.id, { required: event.target.checked });
  };

  return (
    <Paper className={classes.nodeDetails}>
      <LabelComment showComment={showAdvancedDetails} />
      <hr style={{ color: '#96a5f9' }} />
      <SidebarTooltip
        text={`Setting this to True is equivalent to Data Mapping
        being the identity mapping for all input names.
        Cannot be used in combination with data_mapping.`}
      >
        <div>
          <label htmlFor="map-all-data" id="map-all-data">
            <b>Map all Data</b>
          </label>
          <b />
          <Checkbox
            name="map-all-data"
            checked={!!edgeData.map_all_data || false}
            onChange={mapAllDataChanged}
            inputProps={{ 'aria-label': 'controlled' }}
            aria-labelledby="map-all-data"
          />
        </div>
      </SidebarTooltip>
      {!edgeData.map_all_data && isLink(element) && (
        <div>
          <DataMappingComponent {...element} />
        </div>
      )}
      <hr style={{ color: '#96a5f9' }} />
      <SidebarTooltip
        text={`A special condition where the task raises an exception.
        Cannot be used in combination with conditions.`}
      >
        <div>
          <label htmlFor="on_error" id="on_error">
            <b>on_error</b>
          </label>
          <Checkbox
            checked={!!edgeData.on_error || false}
            onChange={onErrorChanged}
            inputProps={{ 'aria-label': 'controlled' }}
            aria-labelledby="on_error"
          />
        </div>
      </SidebarTooltip>
      {!edgeData.on_error && isLink(element) && (
        <div>
          <Conditions element={element} />
        </div>
      )}
      <hr style={{ color: '#96a5f9' }} />
      <AdvancedDetailsCheckbox />
      {showAdvancedDetails && (
        <div>
          <div>
            <b>Required</b>
            <Checkbox
              checked={edgeData.required}
              onChange={requiredChanged}
              // inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
          <div className={classes.detailsLabels}>
            <b>Source:</b> {element.source}
          </div>
          <div className={classes.detailsLabels}>
            <b>Target:</b> {element.target}
          </div>
          {edgeData.sub_target && (
            <div className={classes.detailsLabels}>
              <b>Sub_target:</b> {edgeData.sub_target}
            </div>
          )}
          {edgeData.sub_target_attributes && (
            <div className={classes.detailsLabels}>
              <b>Sub_target_attributes:</b>
              {edgeData.sub_target_attributes}
            </div>
          )}
        </div>
      )}
    </Paper>
  );
}
