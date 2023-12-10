import { TableCell, TableHead, TableRow } from '@mui/material';

import styles from './ExecutionDialog.module.css';

export default function ExecuteParamsTableHeader() {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="center" className={styles.nodesTableCell}>
          <b>Node/s</b>
        </TableCell>
        <TableCell align="center" className={styles.typeTableCell}>
          <b>Type</b>
        </TableCell>
        <TableCell align="center" className={styles.nameTableCell}>
          <b>Name</b>
        </TableCell>
        <TableCell align="center" className={styles.valueTableCell}>
          <b>Value</b>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
