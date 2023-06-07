import type { DragEvent } from 'react';
import type { OverridableComponent } from '@material-ui/core/OverridableComponent';
import type { SvgIconTypeMap } from '@material-ui/core';

interface DragInfo {
  task_identifier: string;
  task_type: string;
  icon: OverridableComponent<SvgIconTypeMap> | string;
}

export function onDragStart(event: DragEvent, dragInfo: DragInfo) {
  const { task_identifier, task_type, icon } = dragInfo;
  event.dataTransfer.setData('task_identifier', task_identifier);
  event.dataTransfer.setData('task_type', task_type);
  event.dataTransfer.setData('icon', icon as string);
  event.dataTransfer.effectAllowed = 'move';
}
