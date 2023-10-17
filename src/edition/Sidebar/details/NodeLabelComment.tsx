import type { Node } from 'reactflow';

import useNodeDataStore from '../../../store/useNodeDataStore';
import {
  assertElementIsNodeType,
  assertNodeDataDefined,
} from '../../../utils/typeGuards';
import InputTextField from './InputTextField';

interface Props {
  selectedElement: Node;
}

export default function NodeLabelComment(props: Props) {
  const { selectedElement } = props;
  assertElementIsNodeType(selectedElement);

  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id),
  );
  assertNodeDataDefined(nodeData, selectedElement.id);

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  function handleSaveLabel(label: string) {
    mergeNodeData(selectedElement.id, { ewoks_props: { label } });
  }

  function handleSaveComment(comment: string) {
    mergeNodeData(selectedElement.id, { comment });
  }

  return (
    <section>
      <InputTextField
        label="Label"
        defaultValue={nodeData.ewoks_props.label}
        onValueSave={handleSaveLabel}
      />
      <InputTextField
        label="Comment"
        defaultValue={nodeData.comment}
        onValueSave={handleSaveComment}
      />
    </section>
  );
}
