import type { RFMarkerEnd } from '../../../types';
import type { MarkerEndOption } from './models';
import { convertRFMarkerEndToEwoks } from '../../../utils/utils';
import { DEFAULT_LINK_VALUES } from '../../../utils/defaultValues';

export function markerEndOptionToRF(option: MarkerEndOption): RFMarkerEnd {
  if (option === 'none') {
    return '';
  }

  return { type: option };
}

export function rfMarkerEndToOption(markerEnd: RFMarkerEnd): MarkerEndOption {
  return (
    convertRFMarkerEndToEwoks(markerEnd) ||
    DEFAULT_LINK_VALUES.uiProps.markerEnd.type
  );
}

export function colorToRFEdgeStyle(color: string | undefined) {
  return {
    style: { stroke: color },
    labelStyle: { fill: color },
    labelBgStyle: { stroke: color },
  };
}
