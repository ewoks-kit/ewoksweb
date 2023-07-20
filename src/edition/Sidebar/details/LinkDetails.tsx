import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Checkbox, Grid, Switch, Typography } from '@material-ui/core';
import DataMappingComponent from '../EditableTableProperties/DataMapping';
import Conditions from '../EditableTableProperties/Conditions';
import SidebarTooltip from '../SidebarTooltip';
import EdgeLabelComment from './EdgeLabelComment';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import type { Edge } from 'reactflow';

import styles from './Details.module.css';

export default function LinkDetails(selectedElement: Edge) {
  const edgeData = useEdgeDataStore((state) =>
    state.edgesData.get(selectedElement.id)
  );

  assertEdgeDataDefined(edgeData, selectedElement.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const [showDataMapping, setShowDataMapping] = useState(
    !edgeData.map_all_data
  );
  const [showConditions, setShowConditions] = useState(!edgeData.map_all_data);

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
      <EdgeLabelComment element={selectedElement} />
      <SidebarTooltip
        text={`Setting this to True is equivalent to Data Mapping
        being the identity mapping for all input names.
        Cannot be used in combination with data_mapping.`}
      >
        <div
          style={{ marginTop: '5px', display: 'grid', placeItems: 'center' }}
        >
          <Typography component="div" style={{ fontSize: '16px' }}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>
                {!showDataMapping ? <b>Map all data</b> : 'Map all data'}
              </Grid>
              <Grid item>
                <Switch
                  checked={showDataMapping}
                  onChange={handleChangeShowDataMapping}
                  name="dataMappingSwitch"
                  color="primary"
                />
              </Grid>
              <Grid item>
                {showDataMapping ? <b>Data Mapping</b> : 'Data Mapping'}
              </Grid>
            </Grid>
          </Typography>
        </div>
      </SidebarTooltip>
      {showDataMapping && (
        <div>
          <DataMappingComponent {...selectedElement} />
        </div>
      )}
      <SidebarTooltip
        text={`A special condition where the task raises an exception.
        Cannot be used in combination with conditions.`}
      >
        <div
          style={{ marginTop: '5px', display: 'grid', placeItems: 'center' }}
        >
          <Typography component="div" style={{ fontSize: '16px' }}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>{!showConditions ? <b>on_error</b> : 'on_error'}</Grid>
              <Grid item>
                <Switch
                  checked={showConditions}
                  onChange={handleChangeShowConditions}
                  name="conditionsSwitch"
                  color="primary"
                />
              </Grid>
              <Grid item>
                {showConditions ? <b>Conditions</b> : 'Conditions'}
              </Grid>
            </Grid>
          </Typography>
        </div>
      </SidebarTooltip>
      {showConditions && (
        <div>
          <Conditions {...selectedElement} />
        </div>
      )}
      <div>
        <div style={{ marginTop: '5px', fontSize: '16px' }}>
          <Checkbox
            checked={edgeData.required}
            onChange={requiredChanged}
            color="primary"
          />
          <b>Required</b>
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
