import { Tooltip } from '@material-ui/core';
import type { ReactElement } from 'react';
import { useEditPageStyles } from '../edition/useEditPageStyles';

export default function SidebarTooltip(props: {
  text: string;
  children: ReactElement;
}) {
  const classes = useEditPageStyles();

  const styleInfo = (title: string) => {
    return (
      <span
        style={{
          borderRadius: '5px',
          border: '3px solid rgb(150, 165, 249)',
          padding: '10px',
          backgroundColor: 'rgb(233, 235, 247)',
          color: 'rgb(57, 65, 111)',
          fontSize: '0.700rem',
          fontWeight: 100,
          lineHeight: '1.13',
        }}
      >
        <b>{title}</b>
      </span>
    );
  };

  return (
    <Tooltip
      placement="right"
      enterDelay={500}
      classes={{ tooltip: classes.root }}
      title={styleInfo(props.text)}
      arrow
    >
      {props.children}
    </Tooltip>
  );
}
