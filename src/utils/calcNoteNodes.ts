import type { NodeRF, Note } from '../types';

// EwoksRFNode --> EwoksNode for saving
export function calcNoteNodes(nodes: NodeRF[]): Note[] {
  return nodes
    .filter((nod) => nod.type === 'note')
    .map((noteNod) => {
      return {
        id: noteNod.id,
        label: noteNod.data.ewoks_props.label,
        comment: noteNod.data.comment,
        position: noteNod.position,
        nodeWidth: noteNod.data.ui_props.nodeWidth,
        colorBorder: noteNod.data.ui_props.colorBorder,
      };
    });
}
