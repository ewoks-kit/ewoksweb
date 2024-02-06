/*
  The table that is used to pass parameters for data-mapping.
*/
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import React from 'react';

import type { DataMapping, RowChangeEvent, TypeOfValues } from '../../../types';
import AddEntryRow from './controls/AddEntryRow';
import RemoveRowCell from './controls/RemoveRowCell';
import StrEditCell from './StrEditCell';
import styles from './Table.module.css';
import TableHeader from './TableHeader';

interface Props {
  values: DataMapping[];
  onValuesChange: (rows: DataMapping[]) => void;
  sourceType: TypeOfValues;
  targetType: TypeOfValues;
  onRowAdd: (rows?: DataMapping[]) => void;
  disable?: boolean;
}

function TableDataMapping(props: Props) {
  const { values, sourceType, targetType, onValuesChange, disable, onRowAdd } =
    props;

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: DataMapping,
  ) {
    const { rowId: id } = row;
    let { value } = e.target;
    const { name } = e.target;

    if (name === 'value') {
      value = typeof value === 'number' ? Number(value) : value;
    }

    const newRows = values.map((rowe) => {
      if (rowe.rowId === id) {
        return { ...rowe, [name]: value };
      }
      return rowe;
    });

    onValuesChange(newRows);
  }

  function onDelete(id: string) {
    const newRows = values.filter((row) => {
      return row.rowId !== id;
    });

    onValuesChange(newRows);
  }

  return (
    <Table
      className={styles.table}
      aria-label="data-mapping-table"
      style={{ opacity: disable ? '0.2' : '1' }}
    >
      <TableHeader headers={['Source', 'Target']} />
      <TableBody>
        {values.map((row) => {
          const handleChange = (evt: RowChangeEvent) => onChange(evt, row);
          return (
            <React.Fragment key={row.rowId}>
              <TableRow>
                <StrEditCell
                  row={row}
                  name="name"
                  onChange={handleChange}
                  typeOfValues={sourceType}
                  disable={disable}
                  width="50%"
                />
                <StrEditCell
                  row={row}
                  name="value"
                  onChange={handleChange}
                  typeOfValues={targetType}
                  disable={disable}
                  width="50%"
                />
                <RemoveRowCell
                  disable={disable}
                  onDelete={() => onDelete(row.rowId || '')}
                />
              </TableRow>
            </React.Fragment>
          );
        })}
        {!disable && (
          <AddEntryRow onClick={() => onRowAdd(values)} colSpan={3} />
        )}
      </TableBody>
    </Table>
  );
}

export default TableDataMapping;
