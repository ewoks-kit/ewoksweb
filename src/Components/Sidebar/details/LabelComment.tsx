import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { EwoksRFLink, EwoksRFNode } from '../../../types';
import { FormControl, TextField, IconButton, Fab } from '@material-ui/core';
import DashboardStyle from '../../Dashboard/DashboardStyle';
import useStore from '../../../store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';
import TextButtonSave from './TextButtonSave';
import SaveIcon from '@material-ui/icons/Save';
import sidebarStyle from '../sidebarStyle';
import { isLink, isNode, isString } from '../../../utils/typeGuards';
import { useReactFlow } from 'reactflow';
import useSelectedElementStore from '../../../store/useSelectedElementStore';

const useStyles = DashboardStyle;

interface LabelCommentProps {
  element: EwoksRFNode | EwoksRFLink;
  showComment: boolean;
}

// DOC: the label and comment for nodes-links when selected
export default function LabelComment(props: LabelCommentProps) {
  const classes = useStyles();

  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

  const { element, showComment } = props;

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState<string>('');
  const [labelChoices, setLabelChoices] = useState([
    'use mappings',
    'use conditions',
  ]);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  const setSelectedElementNew = useSelectedElementStore(
    (state) => state.setSelectedElementNew
  );
  const inExecutionMode = useStore((state) => state.inExecutionMode);

  useEffect(() => {
    if (isNode(element)) {
      setLabel(element.data.ewoks_props.label || '');
      setComment(element.data.comment || '');
      return;
    }

    if (isLink(element)) {
      const { label: elmtLabel } = element;
      if (isString(elmtLabel)) {
        setLabel(elmtLabel);
      }
      setComment(element.data.comment || '');

      const mappings =
        element.data.data_mapping && element.data.data_mapping.length > 0
          ? element.data.data_mapping
              .map(
                (con) => `${con.source_output || ''}->${con.target_input || ''}`
              )
              .join(', ')
          : '';
      const conditions =
        element.data.conditions && element.data.conditions.length > 0
          ? element.data.conditions
              .map(
                (con) =>
                  `${con.source_output || ''}: ${JSON.stringify(con.value)}`
              )
              .join(', ')
          : '';

      setLabelChoices([mappings, conditions, 'text...']);
      return;
    }

    throw new Error('No link or Node tries to access LabelComment');
  }, [element]);

  function saveLabel(labelLocal: string) {
    if (isNode(element)) {
      const newNode = {
        ...element,
        data: {
          ...element.data,
          ewoks_props: {
            ...element.data.ewoks_props,
            label: labelLocal,
          },
        },
      };
      setNodes([...getNodes().filter((nod) => nod.id !== element.id), newNode]);
      setSelectedElementNew({ type: 'node', id: newNode.id });
    }

    if (isLink(element)) {
      const newLink = {
        ...element,
        label: labelLocal,
      };
      setEdges([
        ...getEdges().filter((edge) => edge.id !== element.id),
        newLink,
      ]);
      setSelectedElementNew({ type: 'edge', id: newLink.id });
    }
  }

  function saveComment(commentLocal: string) {
    const newElement = {
      ...element,
      data: { ...element.data, comment: commentLocal },
    };

    if (isNode(newElement)) {
      setSelectedElementNew({ type: 'node', id: newElement.id });
      setNodes([
        ...getNodes().filter((nod) => nod.id !== element.id),
        newElement,
      ]);
      return;
    }

    if (isLink(newElement)) {
      setSelectedElementNew({ type: 'edge', id: newElement.id });
      setEdges([
        ...getEdges().filter((edg) => edg.id !== element.id),
        newElement,
      ]);
    }
  }

  function valueSavedLocal() {
    setValueIsChanged(false);
    saveLabel(label);
  }

  function setChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event && label !== event.target.value) {
      setValueIsChanged(true);
    } else {
      setValueIsChanged(false);
    }
  }

  function valueSelectedChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event?.target.textContent) {
      setChanged(event);
      setLabel(event.target.textContent);
    }
  }

  function valueChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event?.target?.value) {
      setChanged(event);
      setLabel(event.target.value);
    }
  }

  return (
    <div className={classes.detailsLabels}>
      {Object.keys(element).includes('source') ? (
        <SidebarTooltip text="Use Conditions or Data Mapping as label.">
          <FormControl
            fullWidth
            variant="outlined"
            style={{ ...sidebarStyle.formstyleflex }}
          >
            <Autocomplete
              freeSolo
              options={labelChoices}
              value={label}
              onChange={(event) =>
                valueSelectedChanged(event as ChangeEvent<HTMLInputElement>)
              }
              onInputChange={(event) =>
                valueChanged(event as ChangeEvent<HTMLInputElement>)
              }
              style={{ width: valueIsChanged ? '80%' : '98%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Label"
                  margin="normal"
                  variant="outlined"
                  multiline
                />
              )}
            />
            {valueIsChanged && (
              <IconButton
                style={{ width: '20%', minWidth: '30px' }}
                color="inherit"
                onClick={valueSavedLocal}
              >
                <Fab
                  className={classes.openFileButton}
                  color="primary"
                  size="small"
                  component="span"
                  aria-label="saveLabelComment"
                  disabled={inExecutionMode}
                >
                  <SaveIcon />
                </Fab>
              </IconButton>
            )}
          </FormControl>
        </SidebarTooltip>
      ) : (
        <TextButtonSave label="Label" value={label} valueSaved={saveLabel} />
      )}

      <div style={{ display: showComment ? 'block' : 'none' }}>
        <TextButtonSave
          label="Comment"
          value={comment}
          valueSaved={saveComment}
        />
      </div>
    </div>
  );
}
