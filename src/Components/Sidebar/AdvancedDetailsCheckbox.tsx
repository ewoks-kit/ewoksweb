import { Checkbox } from '@material-ui/core';
import useConfigStore from '../../store/useConfigStore';

export default function AdvancedDetailsCheckbox() {
  const showAdvancedDetails = useConfigStore(
    (state) => state.showAdvancedDetails
  );
  const setShowAdvancedDetails = useConfigStore(
    (state) => state.setShowAdvancedDetails
  );

  return (
    <div>
      <b>Advanced</b>
      <Checkbox
        checked={showAdvancedDetails}
        onChange={(e) => setShowAdvancedDetails(e.target.checked)}
        inputProps={{ 'aria-label': 'controlled' }}
        data-cy="advanced-checkbox-links"
      />
    </div>
  );
}
