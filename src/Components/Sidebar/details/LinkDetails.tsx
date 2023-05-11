import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Checkbox, Grid, Switch, Typography } from '@material-ui/core';
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

  const [showDataMapping, setShowDataMapping] = useState<boolean>(
    !edgeData.map_all_data
  );
  const [showConditions, setShowConditions] = useState<boolean>(
    !edgeData.map_all_data
  );

  useEffect(() => {
    setShowDataMapping(!edgeData.map_all_data);
    setShowConditions(!edgeData.on_error);
  }, [edgeData.map_all_data, edgeData.on_error]);

  const requiredChanged = (event: ChangeEvent<HTMLInputElement>) => {
    mergeEdgeData(selectedElement.id, { required: event.target.checked });
  };

  const handleChangeShowDataMapping = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowDataMapping(event.target.checked);
    mergeEdgeData(selectedElement.id, { map_all_data: !event.target.checked });
  };

  const handleChangeShowConditions = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowConditions(event.target.checked);
    mergeEdgeData(selectedElement.id, { on_error: !event.target.checked });
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
      </SidebarTooltip>
      {showDataMapping && isEdgeRF(selectedElement) && (
        <div>
          <DataMappingComponent {...selectedElement} />
        </div>
      )}
      <SidebarTooltip
        text={`A special condition where the task raises an exception.
        Cannot be used in combination with conditions.`}
      >
        <div>
          <Typography component="div" style={{ fontSize: '15px' }}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>{!showConditions ? <b>on_error</b> : 'on_error'}</Grid>
              <Grid item>
                <Switch
                  checked={showConditions}
                  onChange={handleChangeShowConditions}
                  name="conditionsSwitch"
                />
              </Grid>
              <Grid item>
                {showConditions ? <b>Conditions</b> : 'Conditions'}
              </Grid>
            </Grid>
          </Typography>
        </div>
      </SidebarTooltip>
      {showConditions && isEdgeRF(selectedElement) && (
        <div>
          <Conditions {...selectedElement} />
        </div>
      )}
      <div>
        <div>
          <b>Required</b>
          <Checkbox checked={edgeData.required} onChange={requiredChanged} />
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
