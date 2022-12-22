import type { ChangeEvent } from 'react';
import type { EwoksRFLink } from '../../types';
import { Checkbox, Paper } from '@material-ui/core';
import DashboardStyle from '../Dashboard/DashboardStyle';
import useStore from '../../store/useStore';
import DataMappingComponent from './EditableTableProperties/DataMapping';
import Conditions from './EditableTableProperties/Conditions';
import SidebarTooltip from './SidebarTooltip';
import LabelComment from './LabelComment';
import { isLink } from '../../utils/typeGuards';
import useConfigStore from '../../store/useConfigStore';
import AdvancedDetailsCheckbox from './AdvancedDetailsCheckbox';

const useStyles = DashboardStyle;

export default function LinkDetails(element: EwoksRFLink) {
  const classes = useStyles();

  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const showAdvancedDetails = useConfigStore(
    (state) => state.showAdvancedDetails
  );

  const mapAllDataChanged = (event) => {
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, map_all_data: event.target.checked },
      },
      'fromSaveElement'
    );
  };

  function onErrorChanged(event) {
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, on_error: event.target.checked },
      },
      'fromSaveElement'
    );
  }

  const requiredChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, required: event.target.checked },
      },
      'fromSaveElement'
    );
  };

  return (
    <Paper className={classes.nodeDetails}>
      <LabelComment element={element} showComment={showAdvancedDetails} />
      <hr style={{ color: '#96a5f9' }} />
      <SidebarTooltip
        text={`Setting this to True is equivalent to Data Mapping
        being the identity mapping for all input names.
        Cannot be used in combination with data_mapping.`}
      >
        <div>
          <b>Map all Data</b>
          <Checkbox
            checked={!!element.data.map_all_data || false}
            onChange={mapAllDataChanged}
            inputProps={{ 'aria-label': 'controlled' }}
            data-cy="mapAllDataCheckbox"
          />
        </div>
      </SidebarTooltip>
      {!element.data.map_all_data && isLink(element) && (
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
          <b>on_error</b>
          <Checkbox
            checked={!!element.data.on_error || false}
            onChange={onErrorChanged}
            inputProps={{ 'aria-label': 'controlled' }}
            data-cy="onErrorCheckbox"
          />
        </div>
      </SidebarTooltip>
      {!element.data.on_error && isLink(element) && (
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
              checked={element.data.required}
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
          {element.data.sub_target && (
            <div className={classes.detailsLabels}>
              <b>Sub_target:</b> {element.data.sub_target}
            </div>
          )}
          {element.data.sub_target_attributes && (
            <div className={classes.detailsLabels}>
              <b>Sub_target_attributes:</b>
              {element.data.sub_target_attributes}
            </div>
          )}
        </div>
      )}
    </Paper>
  );
}
