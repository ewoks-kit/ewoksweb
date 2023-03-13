import useStore from '../../../store/useStore';
import TextButtonSave from './TextButtonSave';
import type { GraphDetails as GraphDetailsType } from '../../../types';

export default function GraphDetails(graph: GraphDetailsType) {
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const setGraphRFDetails = useStore((state) => state.setGraphRFDetails);

  function saveCategory(category: string) {
    const newGraph = { ...graph, category };
    setGraphAll(newGraph);
  }

  function saveLabel(label: string) {
    const newGraph = { ...graph, label };
    setGraphAll(newGraph);
  }

  function saveComment(comment: string) {
    const newGraph = {
      ...graph,
      uiProps: { ...graph.uiProps, comment },
    };
    setGraphAll(newGraph);
  }

  function setGraphAll(newGraph: GraphDetailsType) {
    setGraphRFDetails(newGraph);
    setSelectedElement(newGraph);
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
