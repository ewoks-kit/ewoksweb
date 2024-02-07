import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import React from 'react';

import type { DataMapping, TypeOfValues } from '../../../types';
import AddEntryRow from './controls/AddEntryRow';
import RemoveRowCell from './controls/RemoveRowCell';
import StrEditCell from './StrEditCell';
import styles from './Table.module.css';
import TableHeader from './TableHeader';

interface Props {
  values: DataMapping[];
  sourceType: TypeOfValues;
  targetType: TypeOfValues;
  onValuesChange: (rows: DataMapping[]) => void;
  onRowAdd: (rows: DataMapping[]) => void;
  disable?: boolean;
}

function DataMappingTable(props: Props) {
  const { values, sourceType, targetType, onValuesChange, disable, onRowAdd } =
    props;

  function onSourceChange(newSource: string, row: DataMapping) {
    const { rowId } = row;

    const newRows = values.map((rowe) =>
      rowe.rowId === rowId ? { ...rowe, source: newSource } : rowe,
    );

    onValuesChange(newRows);
  }

  function onTargetChange(newTarget: string, row: DataMapping) {
    const { rowId } = row;

    const newRows = values.map((rowe) =>
      rowe.rowId === rowId ? { ...rowe, target: newTarget } : rowe,
    );

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
          return (
            <React.Fragment key={row.rowId}>
              <TableRow>
                <StrEditCell
                  value={row.source}
                  onChange={(s) => onSourceChange(s, row)}
                  typeOfValues={sourceType}
                  disable={disable}
                  width="50%"
                  ariaLabel="Edit source"
                />
                <StrEditCell
                  value={row.target}
                  onChange={(t: string) => onTargetChange(t, row)}
                  typeOfValues={targetType}
                  disable={disable}
                  width="50%"
                  ariaLabel="Edit target"
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

export default DataMappingTable;
