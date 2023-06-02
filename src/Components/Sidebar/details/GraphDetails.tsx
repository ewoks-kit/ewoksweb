import useStore from '../../../store/useStore';
import TextButtonSave from './TextButtonSave';

export default function GraphDetails() {
  const graphInfo = useStore((state) => state.graphInfo);
  const mergeGraphInfo = useStore((state) => state.mergeGraphInfo);

  function handleSaveCategory(category: string) {
    mergeGraphInfo({ category });
  }

  function handleSaveLabel(label: string) {
    mergeGraphInfo({ label });
  }

  function handleSaveComment(comment: string) {
    mergeGraphInfo({
      uiProps: { comment },
    });
  }

  return (
    <>
      <TextButtonSave
        label="Label"
        value={graphInfo.label || ''}
        onValueSave={handleSaveLabel}
      />
      <TextButtonSave
        label="Comment"
        value={graphInfo.uiProps?.comment || ''}
        onValueSave={handleSaveComment}
      />
      <TextButtonSave
        label="Category"
        value={graphInfo.category || ''}
        onValueSave={handleSaveCategory}
      />
    </>
  );
}
