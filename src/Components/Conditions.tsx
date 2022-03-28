import React, { useEffect } from 'react';

import type { EwoksRFLink, Inputs } from '../types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import state from '../store/state';

export default function Conditions(propsIn) {
  const { props } = propsIn;
  const { element } = props;

  const [conditions, setConditions] = React.useState<Inputs[]>([]);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const graphRF = state((state) => state.graphRF);
  const setSelectedElement = state((state) => state.setSelectedElement);
  const [elementL, setElementL] = React.useState<EwoksRFLink>(
    {} as EwoksRFLink
  );

  useEffect(() => {
    if (element.data && element.data.conditions) {
      setConditions(element.data.conditions);
    }
  }, [element.id, element]);

  const addConditions = () => {
    const el = element as EwoksRFLink;
    const elCon = el.data.conditions;
    if (elCon && elCon[elCon.length - 1] && elCon[elCon.length - 1].id === '') {
      setOpenSnackbar({
        open: true,
        text: 'Cannot add another line!',
        severity: 'warning',
      });
    } else {
      setSelectedElement(
        {
          ...el,
          data: {
            ...element.data,
            on_error: false,
            conditions: [...elCon, { id: '', name: '', value: '' }],
          },
        },
        'fromSaveElement'
      );
    }
  };

  const conditionsValuesChanged = (table) => {
    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          conditions: table.map((con1) => {
            return {
              source_output: con1.name,
              value: con1.value,
            };
          }),
        },
      },
      'fromSaveElement'
    );
  };

  return (
    <div>
      <b>Conditions </b>
      <IconButton
        style={{ padding: '1px' }}
        aria-label="delete"
        onClick={() => addConditions()}
      >
        <AddCircleOutlineIcon />
      </IconButton>
      {conditions && conditions.length > 0 && (
        <EditableTable
          headers={['Source_output', 'Value']}
          defaultValues={conditions}
          valuesChanged={conditionsValuesChanged}
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
              type: 'input',
            },
          ]}
        />
      )}
    </div>
  );
}
