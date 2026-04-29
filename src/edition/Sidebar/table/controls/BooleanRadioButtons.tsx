import { isBoolean } from 'lodash';

interface Props {
  value: unknown;
  onChange: (newValue: boolean) => void;
  className?: string;
  disabled?: boolean;
}

function BooleanRadioButtons(props: Props) {
  const { className, value: rawValue, onChange, disabled } = props;

  const value = isBoolean(rawValue) ? rawValue.toString() : rawValue;

  return (
    <>
      <label id="trueLabel">
        <input
          className={className}
          aria-labelledby="trueLabel"
          type="radio"
          value="true"
          checked={value === 'true'}
          onChange={() => onChange(true)}
          disabled={disabled}
        />
        True
      </label>

      <label id="falseLabel">
        <input
          className={className}
          aria-labelledby="falseLabel"
          type="radio"
          value="false"
          checked={value === 'false'}
          onChange={() => onChange(false)}
          disabled={disabled}
        />
        False
      </label>
    </>
  );
}

export default BooleanRadioButtons;
