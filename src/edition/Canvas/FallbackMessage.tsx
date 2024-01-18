import useQuickOpenStore from '../../general/useQuickOpenStore';
import { useNodesLength } from '../../store/graph-hooks';
import styles from './FallbackMessage.module.css';

export default function FallbackMessage() {
  const nodesCount = useNodesLength();
  const quickOpenElement = useQuickOpenStore((state) => state.element);

  if (!quickOpenElement || nodesCount !== 0) {
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
            quickOpenElement.click();
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
