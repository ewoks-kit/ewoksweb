import useStore from '../../../store/useStore';
import TextButtonSave from './TextButtonSave';
import type { GraphDetails as GraphDetailsType } from '../../../types';
import { useSelectedElement } from '../../../store/graph-hooks';

export default function GraphDetails() {
  // const setGraphInfo = useStore((state) => state.setGraphInfo);
  const mergeGraphInfo = useStore((state) => state.mergeGraphInfo);
  const graph = useSelectedElement() as GraphDetailsType;

  function saveCategory(category: string) {
    mergeGraphInfo({ category });
  }

  function saveLabel(label: string) {
    mergeGraphInfo({ label });
  }

  function saveComment(comment: string) {
    mergeGraphInfo({
      uiProps: { comment },
    });
  }

  return (
    <>
      <TextButtonSave
        label="Label"
        value={graph.label || ''}
        valueSaved={saveLabel}
      />
      <TextButtonSave
        label="Comment"
        value={graph.uiProps?.comment || ''}
        valueSaved={saveComment}
      />
      <TextButtonSave
        label="Category"
        value={graph.category || ''}
        valueSaved={saveCategory}
      />
    </>
  );
}
