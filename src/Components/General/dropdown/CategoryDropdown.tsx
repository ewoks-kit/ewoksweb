import useStore from 'store/useStore';
import FetchingDropdown from './FetchingDropdown';
import { getFilterableCategories } from './utils';

interface Props {
  onChange: (input: string) => void;
}

// DOC: A dropdown that can be an input as well
function CategoryDropdown(props: Props) {
  const workflows = useStore((state) => state.allWorkflows);
  const options = getFilterableCategories(workflows);

  const { onChange } = props;

  return (
    <FetchingDropdown
      options={options}
      getOptionSelected={(option, value) => option === value}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      placeholder="Categories"
    />
  );
}

export default CategoryDropdown;
