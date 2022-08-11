import React from 'react';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import ExecutionFilters from './ExecutionFilters';
import state from '../store/state';
import type { Event } from '../types';

interface Data {
  host_name: number;
  process_id: number;
  user_name: number;
  name: string;
  job_id: number;
  binding: string;
  workflow_id: string;
  time: string;
  error: string;
  error_message: string;
  error_traceback: string;
  task_uri: string;
  input_uris: string;
  output_uris: string;
  status: string; // "finished"
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

// TODO: replace with the Typescript version
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function getComparator<Key extends keyof any>(
//   order: Order,
//   orderBy: Key
// ): (
//   a: { [key in Key]: number | string },
//   b: { [key in Key]: number | string }
// ) => number {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: string; // keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'workflow_id',
    numeric: false,
    disablePadding: true,
    label: 'workflow_id',
  },
  {
    id: 'job_id',
    numeric: false,
    disablePadding: true,
    label: 'job_id',
  },
  {
    id: 'start time',
    numeric: false,
    disablePadding: true,
    label: 'Started',
  },
  {
    id: 'end time',
    numeric: false,
    disablePadding: true,
    label: 'Ended',
  },
  // {
  //   id: 'Duration',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Duration',
  // },
  {
    id: 'process_id',
    numeric: false,
    disablePadding: true,
    label: 'process_id',
  },
  {
    id: 'user_name',
    numeric: true,
    disablePadding: false,
    label: 'user_name',
  },
  {
    id: 'host_name',
    numeric: true,
    disablePadding: false,
    label: 'host_name',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: string) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/* TODO: do I need the following text */}
              {orderBy === headCell.id ? (
                <Box component="span">{order === 'desc' ? ' ' : '  '}</Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// interface EnhancedTableToolbarProps {
//   selected: number;
// }

function EnhancedTableToolbar(props) {
  const { selected } = props;

  const executedWorkflows = state((state) => state.executedWorkflows);
  const setWatchedWorkflows = state((state) => state.setWatchedWorkflows);

  const addToWatchedJobs = () => {
    console.log('add to jobs to be viewed on the canvas', selected);
    const watchedJobs = [] as Event[][];
    const allExJobs = [...executedWorkflows];
    selected.forEach((selectedjobid) => {
      watchedJobs.push(
        allExJobs.find((job) => job[0].job_id === selectedjobid)
      );
    });
    console.log(watchedJobs);
    setWatchedWorkflows(watchedJobs, false);
  };

  const removeJobs = () => {
    console.log('remove jobs (delete to server) as unwanted', selected);
  };

  return (
    <Toolbar>
      {selected.length > 0 ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {selected.length} selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          <ExecutionFilters />
        </Typography>
      )}
      {selected.length > 0 ? (
        <>
          <Tooltip title="open in editor">
            <IconButton onClick={addToWatchedJobs}>
              <RemoveRedEyeIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={removeJobs}>
              <DeleteIcon color="primary" />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const formatedTime = (time) => {
  const dat = new Date(time);
  // console.log(time, dat, dat.getDay());
  return `${dat.toTimeString().slice(0, 8)}
    ${dat.toDateString()}`;
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('workflow_id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const executedWorkflows = state((state) => state.executedWorkflows);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = executedWorkflows.map((n) => n[0].job_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];
    console.log(selectedIndex, selected, name);
    if (selectedIndex === -1) {
      newSelected = [...selected, name];
    } else if (selectedIndex === 0) {
      newSelected = [...selected.slice(1)];
    } else if (selectedIndex === selected.length - 1) {
      newSelected = [...selected.slice(0, -1)];
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (job_id: string) => selected.includes(job_id);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - executedWorkflows.length)
      : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper>
        <EnhancedTableToolbar selected={selected} />
        <hr style={{ color: '#dee3ff' }} />
        <TableContainer
          style={{
            backgroundColor: 'rgb(227, 229, 244)', // rgb(182, 186, 213)
            borderRadius: '10px',
          }}
        >
          <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={executedWorkflows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(executedWorkflows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  // console.log(row, index);
                  const isItemSelected = isSelected(row[0].job_id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row[0].job_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row[0].job_id}
                      selected={isItemSelected}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        // component="th"
                        id={labelId}
                        align="left"
                        // scope="row"
                        // padding="none"
                      >
                        {row[0].workflow_id}
                      </TableCell>
                      <TableCell align="right">{row[0].job_id}</TableCell>
                      <TableCell align="right">
                        {formatedTime(row[0].time)}
                      </TableCell>
                      <TableCell align="right">
                        {formatedTime(row[1].time)}
                      </TableCell>
                      {/* <TableCell align="right">
                        {formatedTime(
                          new Date(
                            row[1].time.getTime() - row[0].time.getTime()
                          )
                        )}
                      </TableCell> */}
                      <TableCell align="right">{row[0].process_id}</TableCell>
                      <TableCell align="right">{row[0].user_name}</TableCell>
                      <TableCell align="right">{row[0].host_name}</TableCell>
                      {/* <TableCell align="right">{row[0].input_uris}</TableCell>
                      <TableCell align="right">{row[0].output_uris}</TableCell> */}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={executedWorkflows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
