import { useEffect, useState } from 'react';
import DashboardStyle from '../../Dashboard/DashboardStyle';
import TextButtonSave from './TextButtonSave';
import useNodeDataStore from '../../../store/useNodeDataStore';
import useSelectedElementStore from '../../../store/useSelectedElementStore';

const useStyles = DashboardStyle;

interface LabelCommentProps {
  showComment: boolean;
}

// DOC: the label and comment for nodes-links when selected
export default function NodeLabelComment(props: LabelCommentProps) {
  const classes = useStyles();

  const node = useSelectedElementStore((state) => state.selectedElement);
  const { showComment } = props;

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState<string>('');

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  const nodeData = useNodeDataStore((state) => state.nodesData.get(node.id));

  useEffect(() => {
    console.log(node);

    if (node.type === 'node') {
      setLabel(nodeData?.ewoks_props.label || '');
      setComment(nodeData?.comment || '');
      return;
    }

    throw new Error('No Node tries to access NodeLabelComment');
  }, [node, nodeData]);

  function saveLabel(labelLocal: string) {
    if (node.type === 'node' && nodeData) {
      mergeNodeData(node.id, { ewoks_props: { label: labelLocal } });
    }
  }

  function saveComment(commentLocal: string) {
    if (node.type === 'node' && nodeData) {
      mergeNodeData(node.id, { comment: commentLocal });
    }
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
