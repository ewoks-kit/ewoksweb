import { TableCell, TableHead, TableRow } from '@material-ui/core';

import styles from './TableHeader.module.css';

interface Props {
  headers: string[];
}

function TableHeader(props: Props) {
  const { headers } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell align="left" className={styles.cell}>
          <b>{headers[0]}</b>
        </TableCell>
        {!headers[0].startsWith('Source') && (
          <TableCell align="left" className={styles.cell}>
            <b>Type</b>
          </TableCell>
        )}
        <TableCell align="left" className={styles.cell}>
          <b>{headers[1]}</b>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;
