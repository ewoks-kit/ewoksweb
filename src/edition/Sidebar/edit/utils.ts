import type { RFMarkerEnd } from '../../../types';
import type { MarkerEndOption } from './models';

export function markerEndOptionToRF(option: MarkerEndOption): RFMarkerEnd {
  if (option === 'none') {
    return '';
  }

  return { type: option };
}

export function rfMarkerEndToOption(markerEnd: RFMarkerEnd): MarkerEndOption {
  if (!markerEnd || typeof markerEnd === 'string') {
    return 'none';
  }

  return markerEnd.type;
}
