import useStore from '../../../store/useStore';
import TextButtonSave from './TextButtonSave';
import type { GraphDetails as GraphDetailsType } from '../../../types';

export default function GraphDetails(graph: GraphDetailsType) {
  const setGraphRFDetails = useStore((state) => state.setGraphRFDetails);

  function saveCategory(category: string) {
    setGraphRFDetails({ ...graph, category });
  }

  function saveLabel(label: string) {
    setGraphRFDetails({ ...graph, label });
  }

  function saveComment(comment: string) {
    const newGraph = {
      ...graph,
      uiProps: { ...graph.uiProps, comment },
    };
    setGraphRFDetails(newGraph);
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
