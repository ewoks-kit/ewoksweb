import type { Note, stateRFwithGraph } from '../types';

// EwoksRFNode --> EwoksNode for saving
export function calcNoteNodes(graph: stateRFwithGraph): Note[] {
  return graph
    .getNodes()
    .filter((nod) => nod.type === 'note')
    .map((noteNod) => {
      return {
        id: noteNod.id,
        label: noteNod.data.ewoks_props.label,
        comment: noteNod.data.comment,
        position: noteNod.position,
        nodeWidth: noteNod.data.ui_props.nodeWidth,
      } as Note;
    });
}
