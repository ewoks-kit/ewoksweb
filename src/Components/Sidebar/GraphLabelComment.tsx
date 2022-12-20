import useStore from '../../store/useStore';
import { isGraphDetails } from '../../utils/typeGuards';
import TextButtonSave from './TextButtonSave';

// DOC: the label and the comment when the graph is the selectedElement
export default function GraphLabelComment() {
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const selectedElement = useStore((state) => state.selectedElement);

  function saveCategory(category) {
    setSelectedElement(
      {
        ...selectedElement,
        category,
      },
      'fromSaveElement'
    );
  }

  function saveLabel(label: string) {
    setSelectedElement(
      {
        ...selectedElement,
        label,
      },
      'fromSaveElement'
    );
  }

  function saveComment(comment: string) {
    setSelectedElement(
      {
        ...selectedElement,
        uiProps: { ...selectedElement.uiProps, comment },
      },
      'fromSaveElement'
    );
  }

  return (
    <>
      <TextButtonSave
        label="Label"
        value={selectedElement.label}
        valueSaved={saveLabel}
      />
      <TextButtonSave
        label="Comment"
        value={selectedElement.uiProps?.comment}
        valueSaved={saveComment}
      />
      <TextButtonSave
        label="Category"
        value={
          (isGraphDetails(selectedElement) && selectedElement.category) ||
          'No graph selected'
        }
        valueSaved={saveCategory}
      />
    </>
  );
}
