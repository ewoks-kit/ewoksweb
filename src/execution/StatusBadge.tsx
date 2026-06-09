import {
  CancelOutlined,
  CheckCircleOutlined,
  QueryBuilderOutlined,
} from '@mui/icons-material';

import styles from './StatusBadge.module.css';

interface Props {
  status: 'Running' | 'Success' | 'Failed';
}

const ICONS = {
  Success: CheckCircleOutlined,
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
