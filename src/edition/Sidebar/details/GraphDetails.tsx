import useStore from '../../../store/useWorkflowStore';
import InputTextField from './InputTextField';

export default function GraphDetails() {
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const mergeDisplayedWorkflowInfo = useStore(
    (state) => state.mergeDisplayedWorkflowInfo,
  );

  function handleSaveCategory(category: string) {
    mergeDisplayedWorkflowInfo({ category });
  }

  function handleSaveLabel(label: string) {
    mergeDisplayedWorkflowInfo({ label });
  }

  function handleSaveComment(comment: string) {
    mergeDisplayedWorkflowInfo({
      uiProps: { comment },
    });
  }

  return (
    <div key={displayedWorkflowInfo.id}>
      <InputTextField
        label="Label"
        defaultValue={displayedWorkflowInfo.label || ''}
        onValueSave={handleSaveLabel}
      />
      <InputTextField
        label="Comment"
        defaultValue={displayedWorkflowInfo.uiProps?.comment || ''}
        onValueSave={handleSaveComment}
      />
      <InputTextField
        label="Category"
        defaultValue={displayedWorkflowInfo.category || ''}
        onValueSave={handleSaveCategory}
      />
    </div>
  );
}
