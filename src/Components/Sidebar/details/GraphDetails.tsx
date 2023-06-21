import useStore from '../../../store/useStore';
import TextAutosave from './TextAutosave';

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
      <TextAutosave
        label="Label"
        defaultValue={graphInfo.label || ''}
        onValueSave={handleSaveLabel}
      />
      <TextAutosave
        label="Comment"
        defaultValue={graphInfo.uiProps?.comment || ''}
        onValueSave={handleSaveComment}
      />
      <TextAutosave
        label="Category"
        defaultValue={graphInfo.category || ''}
        onValueSave={handleSaveCategory}
      />
    </>
  );
}
