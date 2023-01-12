import { Checkbox } from '@material-ui/core';
import useConfigStore from '../../../store/useConfigStore';

export default function AdvancedDetailsCheckbox() {
  const showAdvancedDetails = useConfigStore(
    (state) => state.showAdvancedDetails
  );
  const setShowAdvancedDetails = useConfigStore(
    (state) => state.setShowAdvancedDetails
  );

  return (
    <div>
      <label htmlFor="advanced" id="advanced-checkbox">
        <b>Advanced</b>
      </label>
      <Checkbox
        name="advanced"
        checked={showAdvancedDetails}
        onChange={(e) => setShowAdvancedDetails(e.target.checked)}
        inputProps={{ 'aria-labelledby': 'advanced-checkbox' }}
        // aria-labelledby="advanced-checkbox"
      />
    </div>
  );
}
