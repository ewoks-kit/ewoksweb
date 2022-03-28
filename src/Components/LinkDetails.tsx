import React, { useEffect } from 'react';

import type { EwoksRFLink } from '../types';
import { Checkbox } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import DataMappingComponent from './DataMapping';
import Conditions from './Conditions';

const useStyles = DashboardStyle;

export default function LinkDetails(propsIn) {
  const classes = useStyles();

  const { props } = propsIn;
  const { element } = props;
  const { on_error } = (element.data && element.data.on_error) || false;
  const { map_all_data } = (element.data && element.data.map_all_data) || false;

  const setSelectedElement = state((state) => state.setSelectedElement);
  const [mapAllData, setMapAllData] = React.useState<boolean>(false);
  const [elementL, setElementL] = React.useState<EwoksRFLink>(
    {} as EwoksRFLink
  );
  // const [dataMapping, setDataMapping] = React.useState<DataMapping[]>([]);
  const [onError, setOnError] = React.useState<boolean>(false);
  // const [conditions, setConditions] = React.useState<Inputs[]>([]);
  // const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  useEffect(() => {
    setElementL(element);
    // if (element.data && element.data.data_mapping) {
    //   setDataMapping(element.data.data_mapping);
    // }
    setMapAllData(!!element.data.map_all_data || false);
    setOnError(!!element.data.on_error || false);
    // if (element.data && element.data.conditions) {
    //   setConditions(element.data.conditions);
    // }
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

  // const addDataMapping = () => {
  //   const el = element as EwoksRFLink;
  //   const elMap = el.data.data_mapping;
  //   if (elMap && elMap[elMap.length - 1] && elMap[elMap.length - 1].id === '') {
  //     setOpenSnackbar({
  //       open: true,
  //       text: 'Cannot add another line!',
  //       severity: 'warning',
  //     });
  //   } else {
  //     setSelectedElement(
  //       {
  //         ...el,
  //         data: {
  //           ...el.data,
  //           data_mapping: [...elMap, { id: '', name: '', value: '' }],
  //         },
  //       },
  //       'fromSaveElement'
  //     );
  //   }
  // };

  // const dataMappingValuesChanged = (table) => {
  //   const dmap: DataMapping[] = table.map((row) => {
  //     return {
  //       source_output: row.name,
  //       target_input: row.value,
  //     };
  //   });
  //   setSelectedElement(
  //     {
  //       ...(element as EwoksRFLink),
  //       data: {
  //         ...element.data,
  //         data_mapping: dmap,
  //         label: dmap
  //           .map((el) => `${el.source_output}->${el.target_input}`)
  //           .join(', '),
  //       },
  //     },
  //     'fromSaveElement'
  //   );
  // };

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

  // const addConditions = () => {
  //   const el = element as EwoksRFLink;
  //   const elCon = el.data.conditions;
  //   if (elCon && elCon[elCon.length - 1] && elCon[elCon.length - 1].id === '') {
  //     setOpenSnackbar({
  //       open: true,
  //       text: 'Cannot add another line!',
  //       severity: 'warning',
  //     });
  //   } else {
  //     setSelectedElement(
  //       {
  //         ...el,
  //         data: {
  //           ...element.data,
  //           on_error: false,
  //           conditions: [...elCon, { id: '', name: '', value: '' }],
  //         },
  //       },
  //       'fromSaveElement'
  //     );
  //   }
  // };

  // const conditionsValuesChanged = (table) => {
  //   setSelectedElement(
  //     {
  //       ...element,
  //       data: {
  //         ...element.data,
  //         conditions: table.map((con1) => {
  //           return {
  //             source_output: con1.name,
  //             value: con1.value,
  //           };
  //         }),
  //       },
  //     },
  //     'fromSaveElement'
  //   );
  // };

  return (
    <>
      <div className={classes.detailsLabels}>
        <b>Source:</b> {props.element.source}
      </div>
      <div className={classes.detailsLabels}>
        <b>Target:</b> {props.element.target}
      </div>
      {props.element.sub_target && (
        <div className={classes.detailsLabels}>
          <b>Sub_target:</b> {props.element.data.sub_target}
        </div>
      )}
      {props.element.sub_target_attributes && (
        <div className={classes.detailsLabels}>
          <b>Sub_target_attributes:</b>
          {props.element.data.sub_target_attributes}
        </div>
      )}
      <div>
        <b>Map all Data</b>
        <Checkbox
          checked={mapAllData}
          onChange={mapAllDataChanged}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>
      {!mapAllData && elementL.source && (
        <div>
          <DataMappingComponent
            props={{
              ...props,
            }}
          />
          {/* <b>Data Mapping </b>
          <IconButton
            style={{ padding: '1px' }}
            aria-label="delete"
            onClick={() => addDataMapping()}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          {dataMapping.length > 0 && (
            <EditableTable
              headers={['Source', 'Target']}
              defaultValues={dataMapping}
              valuesChanged={dataMappingValuesChanged}
              typeOfValues={[
                {
                  type: elementL.source
                    ? ['class'].includes(
                        graphRF &&
                          graphRF.nodes[0] &&
                          graphRF.nodes.find((nod) => {
                            return nod.id === elementL.source;
                          }).task_type
                      )
                      ? 'select'
                      : 'input'
                    : 'input',
                  values: props.element.data.links_input_names || [],
                },
                {
                  type: elementL.target
                    ? ['class'].includes(
                        graphRF &&
                          graphRF.nodes[0] &&
                          graphRF.nodes.find((nod) => {
                            return nod.id === elementL.target;
                          }).task_type
                      )
                      ? 'select'
                      : 'input'
                    : 'input',
                  values:
                    [
                      ...props.element.data.links_required_output_names,
                      ...props.element.data.links_optional_output_names,
                    ] || [],
                },
              ]}
            />
          )} */}
        </div>
      )}
      <div>
        <b>on_error</b>
        <Checkbox
          checked={onError}
          onChange={onErrorChanged}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>
      {!onError && elementL.source && (
        <Conditions
          props={{
            ...props,
          }}
        />
        // <div>

        //   <b>Conditions </b>
        //   <IconButton
        //     style={{ padding: '1px' }}
        //     aria-label="delete"
        //     onClick={() => addConditions()}
        //   >
        //     <AddCircleOutlineIcon />
        //   </IconButton>
        //   {conditions && conditions.length > 0 && (
        //     <EditableTable
        //       headers={['Source_output', 'Value']}
        //       defaultValues={conditions}
        //       valuesChanged={conditionsValuesChanged}
        //       typeOfValues={[
        //         {
        //           type: elementL.source
        //             ? ['class'].includes(
        //                 graphRF &&
        //                   graphRF.nodes[0] &&
        //                   graphRF.nodes.find((nod) => {
        //                     return nod.id === elementL.source;
        //                   }).task_type
        //               )
        //               ? 'select'
        //               : 'input'
        //             : 'input',
        //           values: props.element.data.links_input_names || [],
        //         },
        //         {
        //           type: 'input',
        //         },
        //       ]}
        //     />
        //   )}
        // </div>
      )}

      <hr />
    </>
  );
}
