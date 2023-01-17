import useStore from '../../../store/useStore';
import TextButtonSave from './TextButtonSave';
import type { GraphDetails as GraphDetailsType } from '../../../types';

export default function GraphDetails(graph: GraphDetailsType) {
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  function saveCategory(category: string) {
    setSelectedElement(
      {
        ...graph,
        category,
      },
      'fromSaveElement'
    );
  }

  function saveLabel(label: string) {
    setSelectedElement(
      {
        ...graph,
        label,
      },
      'fromSaveElement'
    );
  }

  function saveComment(comment: string) {
    setSelectedElement(
      {
        ...graph,
        uiProps: { ...graph.uiProps, comment },
      },
      'fromSaveElement'
    );
  }

  return (
    <>
      <TextButtonSave
        label="Label"
        value={graph.label}
        valueSaved={saveLabel}
      />
      <TextButtonSave
        label="Comment"
        value={graph.uiProps?.comment}
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
