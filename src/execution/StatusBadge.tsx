import {
  CancelOutlined,
  CheckCircleOutline,
  QueryBuilderOutlined,
} from '@material-ui/icons';
import styles from './StatusBadge.module.css';

interface Props {
  status: 'Running' | 'Success' | 'Failed';
}

const ICONS = {
  Success: CheckCircleOutline,
  Running: QueryBuilderOutlined,
  Failed: CancelOutlined,
};

function StatusBadge(props: Props) {
  const { status } = props;

  const Icon = ICONS[status];

  return (
    <div className={styles.badge} data-status={status}>
      <Icon className={styles.icon} />
      {status}
    </div>
  );
}

export default StatusBadge;
