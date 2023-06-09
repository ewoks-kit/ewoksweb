import { nanoid } from 'nanoid';
import type { DataMappingEwoks, EditableTableRow } from '../types';

export function createDataMappingData(
  pair: DataMappingEwoks
): EditableTableRow {
  return {
    id: nanoid(),
    name: pair.source_output ? pair.source_output.toString() : '',
    value: pair.target_input ?? '',
  };
}
