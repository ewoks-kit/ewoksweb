import { useEffect, useState } from 'react';
import DashboardStyle from '../../Dashboard/DashboardStyle';
import TextButtonSave from './TextButtonSave';
import useNodeDataStore from '../../../store/useNodeDataStore';
import useSelectedElementStore from '../../../store/useSelectedElementStore';
import {
  assertNodeDataDefined,
  assertElementIsNodeType,
} from '../../../utils/typeGuards';

const useStyles = DashboardStyle;

interface LabelCommentProps {
  showComment: boolean;
}

// DOC: the label and comment for nodes-links when selected
export default function NodeLabelComment(props: LabelCommentProps) {
  const classes = useStyles();

  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );
  assertElementIsNodeType(selectedElement);
  const { showComment } = props;

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState('');

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id)
  );
  assertNodeDataDefined(nodeData, selectedElement.id);

  useEffect(() => {
    setLabel(nodeData?.ewoks_props.label || '');
    setComment(nodeData?.comment || '');
  }, [nodeData]);

  function saveLabel(labelLocal: string) {
    mergeNodeData(selectedElement.id, { ewoks_props: { label: labelLocal } });
  }

  function saveComment(commentLocal: string) {
    mergeNodeData(selectedElement.id, { comment: commentLocal });
  }

  return (
    <div className={classes.detailsLabels}>
      <TextButtonSave label="Label" value={label} valueSaved={saveLabel} />
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
