import React, { useEffect } from 'react';

import type { EwoksRFLink } from '../types';
import { Checkbox, Paper } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import DataMappingComponent from './DataMapping';
import Conditions from './Conditions';
import SidebarTooltip from './SidebarTooltip';
import LabelComment from './LabelComment';

const useStyles = DashboardStyle;

export default function LinkDetails(props) {
  const classes = useStyles();

  const { element } = props;
  const { on_error } = (element.data && element.data.on_error) || false;
  const { map_all_data } = (element.data && element.data.map_all_data) || false;

  const setSelectedElement = state((state) => state.setSelectedElement);

  const [mapAllData, setMapAllData] = React.useState<boolean>(false);
  const [elementL, setElementL] = React.useState<EwoksRFLink>(
    {} as EwoksRFLink
  );
  const [onError, setOnError] = React.useState<boolean>(false);
  const [advanced, setAdvanced] = React.useState<boolean>(false);

  useEffect(() => {
    setElementL(element);
    setMapAllData(!!element.data.map_all_data || false);
    setOnError(!!element.data.on_error || false);
  }, [element.id, element, on_error, map_all_data]);

  const mapAllDataChanged = (event) => {
    setMapAllData(event.target.checked);

    setSelectedElement(
      {
        ...(element as EwoksRFLink),
        data: { ...element.data, map_all_data: event.target.checked },
      },
      'fromSaveElement'
    );
  };

  const onErrorChanged = (event) => {
    setOnError(event.target.checked);
    setSelectedElement(
      {
        ...(element as EwoksRFLink),
        data: { ...element.data, on_error: event.target.checked },
      },
      'fromSaveElement'
    );
  };

  const advancedChanged = (event) => {
    setAdvanced(event.target.checked);
  };

  return (
    <>
      <Paper
        style={{
          backgroundColor: '#e9ebf7',
          borderRadius: '10px 0px 0px 10px',
          minWidth: '273px',
          border: '#96a5f9',
          borderStyle: 'solid none solid solid',
          padding: '4px',
          marginBottom: '10px',
        }}
      >
        <LabelComment element={element} showComment={advanced} />
        <hr style={{ color: '#96a5f9' }} />
        <SidebarTooltip
          text={`Setting this to True is equivalent to Data Mapping
        being the identity mapping for all input names.
        Cannot be used in combination with data_mapping.`}
        >
          <div>
            <b>Map all Data</b>
            <Checkbox
              checked={mapAllData}
              onChange={mapAllDataChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </SidebarTooltip>
        {!mapAllData && elementL.source && (
          <SidebarTooltip
            text={`Describes the data transfer from source output to
          target input arguments.`}
          >
            <div>
              <DataMappingComponent element={element} />
            </div>
          </SidebarTooltip>
        )}
        <hr style={{ color: '#96a5f9' }} />
        <SidebarTooltip
          text={`A special condition where the task raises an exception.
        Cannot be used in combination with conditions.`}
        >
          <div>
            <b>on_error</b>
            <Checkbox
              checked={onError}
              onChange={onErrorChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </SidebarTooltip>
        {!onError && elementL.source && (
          <SidebarTooltip
            text={`Provides a list of expected values for source outputs.
          [{"source_output": "result", "value": 10}]`}
          >
            <div>
              <Conditions element={element} />
            </div>
          </SidebarTooltip>
        )}
        <hr style={{ color: '#96a5f9' }} />
        <div>
          <b>Advanced</b>
          <Checkbox
            checked={advanced}
            onChange={advancedChanged}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
        <div style={{ display: advanced ? 'block' : 'none' }}>
          <div className={classes.detailsLabels}>
            <b>Source:</b> {element.source}
          </div>
          <div className={classes.detailsLabels}>
            <b>Target:</b> {element.target}
          </div>
          {element.sub_target && (
            <div className={classes.detailsLabels}>
              <b>Sub_target:</b> {element.data.sub_target}
            </div>
          )}
          {element.sub_target_attributes && (
            <div className={classes.detailsLabels}>
              <b>Sub_target_attributes:</b>
              {element.data.sub_target_attributes}
            </div>
          )}
        </div>
      </Paper>
      {/* <hr /> */}
    </>
  );
}
