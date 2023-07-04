import { useNavigate } from 'react-router-dom';
import styles from './TopNavBar.module.css';

function EditMonitorSwitch(props: { onPage: 'edit' | 'monitor' | undefined }) {
  const { onPage } = props;
  const navigate = useNavigate();

  return (
    <span
      style={{
        flexBasis: '40%',
      }}
    >
      <span className={styles.logo}>EwoksWeb</span>
      <span
        className={
          onPage === 'edit' ? styles.pageLabelSelected : styles.pageLabel
        }
        style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
        onClick={() => navigate('/')}
        onKeyPress={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
      >
        Edit
      </span>
      |
      <span
        className={
          onPage === 'monitor' ? styles.pageLabelSelected : styles.pageLabel
        }
        style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
        onClick={() => window.open('/monitor-workflows', '_blank')}
        onKeyPress={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
      >
        Monitor
      </span>
    </span>
  );
}

export default EditMonitorSwitch;
