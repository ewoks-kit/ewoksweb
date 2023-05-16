import { useEffect, useState } from 'react';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import TextButtonSave from './TextButtonSave';
import useNodeDataStore from '../../../store/useNodeDataStore';
import {
  assertNodeDataDefined,
  assertElementIsNodeType,
} from '../../../utils/typeGuards';
import type { Node } from 'reactflow';

interface LabelCommentProps {
  showComment: boolean;
  selectedElement: Node;
}

// DOC: the label and comment for nodes-links when selected
export default function NodeLabelComment(props: LabelCommentProps) {
  const classes = useDashboardStyles();

  const { showComment, selectedElement } = props;
  assertElementIsNodeType(selectedElement);

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState('');

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id)
  );
  assertNodeDataDefined(nodeData, selectedElement.id);

  useEffect(() => {
    setLabel(nodeData.ewoks_props.label || '');
    setComment(nodeData.comment || '');
  }, [nodeData]);

  function saveLabel(labelLocal: string) {
    console.log(labelLocal);

    mergeNodeData(selectedElement.id, { ewoks_props: { label: labelLocal } });
  }

  function saveComment(commentLocal: string) {
    console.log(commentLocal);
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
