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

  const [comment, setComment] = useState<string>();
  const [label, setLabel] = useState<string>();

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id)
  );
  // TBD: the props seem to be ok but an undefined appears in TextButtonSave
  // console.log(selectedElement.id, nodeData?.ewoks_props.label);
  assertNodeDataDefined(nodeData, selectedElement.id);

  useEffect(() => {
    setLabel(nodeData.ewoks_props.label || '');
    setComment(nodeData.comment || '');
  }, [nodeData.ewoks_props.label, nodeData.comment]);

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
