import type { GraphRF, Note } from '../types';

// EwoksRFNode --> EwoksNode for saving
export function calcNoteNodes(graph: GraphRF): Note[] {
  return graph.nodes
    .filter((nod) => nod.type === 'note')
    .map((noteNod) => {
      return {
        id: noteNod.id,
        label: noteNod.data.ewoks_props.label,
        comment: noteNod.data.comment,
        position: noteNod.position,
        nodeWidth: noteNod.data.ui_props.nodeWidth,
        colorBorder: noteNod.data.ui_props.colorBorder,
      } as Note;
    });
}
