import { nanoid } from 'nanoid';
import type { Edge } from 'reactflow';

import useEdgeDataStore from '../../../store/useEdgeDataStore';
import type { Condition, LinkData } from '../../../types';
import { RowType } from '../../../types';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import EditableTable from './EditableTable';
import styles from './Table.module.css';
import { calcEdgeInputOptions } from './utils';

interface Props {
  element: Edge;
  isOnErrorSelected?: boolean;
}

// DOC: The conditions for a link are being set in this component
export default function Conditions({ element, isOnErrorSelected }: Props) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);

  function addConditions(rows: Condition[]) {
    const elCon = rows;

    const newEdgeData = {
      on_error: false,
      conditions: [
        ...elCon,
        { rowId: nanoid(), name: '', value: false, type: RowType.Bool },
      ],
    };
    mergeEdgeData(element.id, newEdgeData);
  }

  function conditionsValuesChanged(table: Condition[]) {
    const newEdgeData: LinkData = {
      ...edgeData,
      conditions: table.map((con) => {
        return {
          rowId: con.rowId,
          name: con.name,
          value: con.value,
          type: con.type,
        };
      }),
    };
    setEdgeData(element.id, newEdgeData);
  }

  return (
    <div>
      <EditableTable
        disable={isOnErrorSelected}
        headers={['Output', 'Value']}
        defaultValues={edgeData.conditions || []}
        valuesChanged={conditionsValuesChanged}
        onRowAdd={(rows) => addConditions(rows)}
        nameOptions={calcEdgeInputOptions(edgeData)}
      />
      {isOnErrorSelected && (
        <div className={styles.warning}>
          Conditions have no effect when On Error condition is enabled. They
          will be removed when saving the workflow.
        </div>
      )}
    </div>
  );
}
