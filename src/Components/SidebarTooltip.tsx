import { Tooltip } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';

const useStyles = DashboardStyle;

export default function SidebarTooltip(props) {
  const classes = useStyles();

  const styleInfo = (title) => {
    return (
      <span
        style={{
          borderRadius: '5px',
          border: '2px solid rgb(150, 165, 249)',
          padding: '10px',
          backgroundColor: 'grey', // 'rgb(63, 81, 181)',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 200,
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
