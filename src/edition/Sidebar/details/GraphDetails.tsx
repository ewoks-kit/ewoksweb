import useStore from '../../../store/useStore';
import InputTextField from './InputTextField';

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
    <div key={graphInfo.id}>
      <InputTextField
        label="Label"
        defaultValue={graphInfo.label || ''}
        onValueSave={handleSaveLabel}
      />
      <InputTextField
        label="Comment"
        defaultValue={graphInfo.uiProps?.comment || ''}
        onValueSave={handleSaveComment}
      />
      <InputTextField
        label="Category"
        defaultValue={graphInfo.category || ''}
        onValueSave={handleSaveCategory}
      />
    </div>
  );
}
