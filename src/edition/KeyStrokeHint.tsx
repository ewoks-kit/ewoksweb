import styles from './EditPage.module.css';

function KeyStrokeHint({ text }: { text: string }) {
  return <span className={styles.keyStrokeHint}>{text}</span>;
}

export default KeyStrokeHint;
