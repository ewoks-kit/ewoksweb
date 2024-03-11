import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import React from 'react';

import type { DataMapping, Options } from '../../../types';
import AddEntryRow from './controls/AddEntryRow';
import RemoveRowCell from './controls/RemoveRowCell';
import StrOrNumEditCell from './StrOrNumEditCell';
import styles from './Table.module.css';
import TableHeader from './TableHeader';

interface Props {
  values: DataMapping[];
  onValuesChange: (rows: DataMapping[]) => void;
  onRowAdd: (rows: DataMapping[]) => void;
  sourceOptions?: Options;
  targetOptions?: Options;
  disable?: boolean;
}

function DataMappingTable(props: Props) {
  const {
    values,
    sourceOptions,
    targetOptions,
    onValuesChange,
    disable,
    onRowAdd,
  } = props;

  function handleSourceChange(newSource: string | number, row: DataMapping) {
    const { rowId } = row;

    const newRows = values.map((rowe) =>
      rowe.rowId === rowId ? { ...rowe, source: newSource } : rowe,
    );

    onValuesChange(newRows);
  }

  function handleTargetChange(newTarget: string | number, row: DataMapping) {
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
                <StrOrNumEditCell
                  value={row.source}
                  onChange={(newSource) => handleSourceChange(newSource, row)}
                  options={sourceOptions}
                  disable={disable}
                  width="50%"
                  ariaLabel="Edit source"
                />
                <StrOrNumEditCell
                  value={row.target}
                  onChange={(newTarget) => handleTargetChange(newTarget, row)}
                  options={targetOptions}
                  disable={disable}
                  width="50%"
                  ariaLabel="Edit target"
                />
                <RemoveRowCell
                  disable={disable}
                  onDelete={() => onDelete(row.rowId)}
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
