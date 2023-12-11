import useQuickOpenDropdownState from '../../general/useQuickOpenDropdownState';
import { useNodesLength } from '../../store/graph-hooks';
import styles from './FallbackMessage.module.css';

export default function FallbackMessage() {
  const nodesCount = useNodesLength();
  const quickOpenDropdown = useQuickOpenDropdownState((state) => state.element);

  if (!quickOpenDropdown || nodesCount !== 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <p>
        Drag and drop tasks here to start building your workflow,
        <br />
        or use{' '}
        <button
          className={styles.btn}
          onClick={() => {
            quickOpenDropdown.click();
          }}
          type="button"
        >
          Quick Open
        </button>{' '}
        to open an existing workflow.
      </p>
    </div>
  );
}
