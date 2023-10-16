import { useEffect, useState } from 'react';
import type { Node } from 'reactflow';

import useNodeDataStore from '../../../store/useNodeDataStore';
import {
  assertElementIsNodeType,
  assertNodeDataDefined,
} from '../../../utils/typeGuards';
import InputTextField from './InputTextField';

interface Props {
  showComment: boolean;
  selectedElement: Node;
}

// DOC: the label and comment for nodes-links when selected
export default function NodeLabelComment(props: Props) {
  const { showComment, selectedElement } = props;
  assertElementIsNodeType(selectedElement);

  const [comment, setComment] = useState<string>();
  const [label, setLabel] = useState<string>();

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id),
  );
  assertNodeDataDefined(nodeData, selectedElement.id);

  useEffect(() => {
    setLabel(nodeData.ewoks_props.label || '');
    setComment(nodeData.comment || '');
  }, [nodeData.ewoks_props.label, nodeData.comment]);

  function handleSaveLabel(labelLocal: string) {
    mergeNodeData(selectedElement.id, { ewoks_props: { label: labelLocal } });
  }

  function handleSaveComment(commentLocal: string) {
    mergeNodeData(selectedElement.id, { comment: commentLocal });
  }

  return (
    <section>
      <InputTextField
        label="Label"
        defaultValue={label}
        onValueSave={handleSaveLabel}
      />
      <div style={{ display: showComment ? 'block' : 'none' }}>
        <InputTextField
          label="Comment"
          defaultValue={comment}
          onValueSave={handleSaveComment}
        />
      </div>
    </section>
  );
}
