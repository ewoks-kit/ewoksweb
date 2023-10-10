/*
  The table that is used to pass parameters for data-mapping.
*/
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import type { DataMapping, TypeOfValues } from 'types';

import AddEntryRow from './controls/AddEntryRow';
import RemoveRowCell from './controls/RemoveRowCell';
import CustomTableCell from './CustomTableCell';
import styles from './Table.module.css';
import TableHeader from './TableHeader';

interface TableDataMappingProps {
  disable?: boolean;
  headers: string[];
  values: DataMapping[];
  typeOfValues: TypeOfValues[];
  valuesChanged: (rows: DataMapping[]) => void;
  onRowAdd?: (rows?: DataMapping[]) => void;
}

function TableDataMapping(props: TableDataMappingProps) {
  const { values, headers, disable, onRowAdd } = props;

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: DataMapping,
  ) {
    const { id } = row;
    let { value } = e.target;
    const { name } = e.target;

    if (name === 'value') {
      value = typeof value === 'number' ? Number(value) : value;
    }

    const newRows = values.map((rowe) => {
      if (rowe.id === id) {
        return { ...rowe, [name]: value };
      }
      return rowe;
    });

    props.valuesChanged(newRows);
  }

  function onDelete(id: string) {
    const newRows = values.filter((row) => {
      return row.id !== id;
    });

    props.valuesChanged(newRows);
  }

  return (
    <>
      <Table
        className={styles.table}
        aria-label="data-mapping-table"
        style={{ opacity: disable ? '0.2' : '1' }}
      >
        <TableHeader headers={headers} />
        <TableBody>
          {values.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <CustomTableCell
                  index={index}
                  row={row}
                  rowsNames={values.map((ro) => ro.name || '')}
                  name="name"
                  onChange={onChange}
                  typeOfValues={props.typeOfValues[0]}
                  usedIn="DataMapping"
                  disable={disable}
                />
                <CustomTableCell
                  index={index}
                  row={row}
                  name="value"
                  onChange={onChange}
                  typeOfValues={props.typeOfValues[1]}
                  usedIn="DataMapping"
                  disable={disable}
                />
                <RemoveRowCell
                  disable={disable}
                  onDelete={() => onDelete(row.id || '')}
                />
              </TableRow>
            </React.Fragment>
          ))}
          {onRowAdd && !disable && (
            <AddEntryRow onClick={() => onRowAdd(values)} colSpan={3} />
          )}
        </TableBody>
      </Table>
      {disable && (
        <div className={styles.warning}>
          Data Mappings have no effect when Map all Data is enabled. They will
          be removed when saving the workflow.
        </div>
      )}
    </>
  );
}

export default TableDataMapping;
