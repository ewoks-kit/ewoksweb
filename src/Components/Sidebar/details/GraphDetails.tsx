import useStore from '../../../store/useStore';
import TextButtonSave from './TextButtonSave';

export default function GraphDetails() {
  const graphInfo = useStore((state) => state.graphInfo);
  const mergeGraphInfo = useStore((state) => state.mergeGraphInfo);

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
        value={graphInfo.label || ''}
        valueSaved={saveLabel}
      />
      <TextButtonSave
        label="Comment"
        value={graphInfo.uiProps?.comment || ''}
        valueSaved={saveComment}
      />
      <TextButtonSave
        label="Category"
        value={graphInfo.category || ''}
        valueSaved={saveCategory}
      />
    </>
  );
}
