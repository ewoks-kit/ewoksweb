import { useEffect, useState } from 'react';
import InputTextField from './InputTextField';
import useNodeDataStore from '../../../store/useNodeDataStore';
import {
  assertNodeDataDefined,
  assertElementIsNodeType,
} from '../../../utils/typeGuards';
import type { Node } from 'reactflow';

import styles from './Details.module.css';

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
    state.nodesData.get(selectedElement.id)
  );
  // TBD: the props seem to be ok but an undefined appears in TextAutosave
  // console.log(selectedElement.id, nodeData?.ewoks_props.label);
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
    <div className={styles.entry}>
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
    </div>
  );
}
