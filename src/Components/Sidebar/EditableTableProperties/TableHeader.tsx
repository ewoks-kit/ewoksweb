import { TableCell, TableHead, TableRow } from '@material-ui/core';
import { useStyles } from './EditableTable';

interface Props {
  headers: string[];
}

function TableHeader(props: Props) {
  const { headers } = props;

  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {!headers[0].startsWith('Source') && (
          <TableCell align="left" className={classes.tableCell}>
            Type
          </TableCell>
        )}
        <TableCell align="left" className={classes.tableCell}>
          <b>{headers[0]}</b>
        </TableCell>
        <TableCell align="left" className={classes.tableCell}>
          <b>{headers[1]}</b>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;
