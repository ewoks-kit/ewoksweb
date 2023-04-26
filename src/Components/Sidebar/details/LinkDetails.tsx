import type { ChangeEvent } from 'react';
import { Checkbox } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import DataMappingComponent from '../EditableTableProperties/DataMapping';
import Conditions from '../EditableTableProperties/Conditions';
import SidebarTooltip from '../SidebarTooltip';
import EdgeLabelComment from './EdgeLabelComment';
import { assertEdgeDataDefined, isEdgeRF } from '../../../utils/typeGuards';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import type { Edge } from 'reactflow';

export default function LinkDetails(selectedElement: Edge) {
  const classes = useDashboardStyles();

  const edgeData = useEdgeDataStore((state) =>
    state.edgesData.get(selectedElement.id)
  );
  assertEdgeDataDefined(edgeData, selectedElement.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const mapAllDataChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    mergeEdgeData(selectedElement.id, { map_all_data: event.target.checked });
  };

  function onErrorChanged(event: React.ChangeEvent<HTMLInputElement>) {
    mergeEdgeData(selectedElement.id, { on_error: event.target.checked });
  }

  const requiredChanged = (event: ChangeEvent<HTMLInputElement>) => {
    mergeEdgeData(selectedElement.id, { required: event.target.checked });
  };

  return (
    <>
      <EdgeLabelComment />
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
      {!edgeData.map_all_data && isEdgeRF(selectedElement) && (
        <div>
          <DataMappingComponent {...selectedElement} />
        </div>
      )}
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
      {!edgeData.on_error && isEdgeRF(selectedElement) && (
        <div>
          <Conditions {...selectedElement} />
        </div>
      )}
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
          <b>Source:</b> {selectedElement.source}
        </div>
        <div className={classes.detailsLabels}>
          <b>Target:</b> {selectedElement.target}
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
    </>
  );
}
