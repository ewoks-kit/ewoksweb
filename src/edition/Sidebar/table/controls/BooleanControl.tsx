import styles from './BooleanControl.module.css';
import BooleanRadioButtons from './BooleanRadioButtons';

interface Props {
  value: unknown;
  onChange: (newValue: boolean) => void;
  disabled?: boolean;
}

function BooleanControl(props: Props) {
  const { value, onChange, disabled } = props;

  return (
    <div className={styles.container}>
      <BooleanRadioButtons
        className={styles.input}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

export default BooleanControl;
