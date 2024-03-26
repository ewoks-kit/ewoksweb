import { MarkerType } from 'reactflow';

import type { RFMarkerEnd } from '../../../types';
import { MarkerEndOption } from './models';

export function markerEndOptionToRF(option: MarkerEndOption): RFMarkerEnd {
  if (option === MarkerEndOption.None) {
    return '';
  }

  if (option === MarkerEndOption.Arrow) {
    return { type: MarkerType.Arrow };
  }

  return { type: MarkerType.ArrowClosed };
}

export function rfMarkerEndToOption(markerEnd: RFMarkerEnd): MarkerEndOption {
  if (!markerEnd || typeof markerEnd === 'string') {
    return MarkerEndOption.None;
  }

  if (markerEnd.type === MarkerType.Arrow) {
    return MarkerEndOption.Arrow;
  }

  return MarkerEndOption.ArrowClosed;
}
