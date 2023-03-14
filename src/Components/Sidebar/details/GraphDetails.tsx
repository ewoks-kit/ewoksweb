import useStore from '../../../store/useStore';
import TextButtonSave from './TextButtonSave';
import type { GraphDetails as GraphDetailsType } from '../../../types';
import useSelectedElementStore from 'store/useSelectedElementStore';

export default function GraphDetails(graph: GraphDetailsType) {
  const setSelectedElementNew = useSelectedElementStore(
    (state) => state.setSelectedElementNew
  );
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
    setSelectedElementNew({ type: 'graph', id: newGraph.id });
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
