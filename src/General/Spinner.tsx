import styles from './Spinner.module.css';

function Spinner() {
  return (
    <div className={styles.container}>
      <svg
        className={styles.spinner}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="50" r="10" />
        <circle cx="90" cy="50" r="10" />
      </svg>
      <span>Loading...</span>
    </div>
  );
}

export default Spinner;
