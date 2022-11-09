import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import type { GraphNodes } from '../types';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '1px',
    overflowX: 'auto',
  },
  table: {
    padding: '1px',
    minWidth: 160,
    maxWidth: 270,
  },
  tableCell: {
    width: 120,
    height: 20,
    padding: '1px',
  },
}));

export default function DenseTable(props) {
  const classes = useStyles();

  let hasSubnode = false;
  props.data.forEach((dat) => {
    if (dat.sub_node) {
      hasSubnode = true;
    }
  });

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>
              <b>id</b>
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              <b>Node</b>
            </TableCell>
            {hasSubnode && (
              <TableCell align="left" className={classes.tableCell}>
                <b>Subnode</b>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.length > 0 &&
            props.data.map((row: GraphNodes) => (
              <TableRow key={`${row.id}${row.node}${row.sub_node}`}>
                <TableCell>{row.id}</TableCell>
                <TableCell align="left">{row.node}</TableCell>
                <TableCell align="left">{row.sub_node}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
