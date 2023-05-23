import type { MenuProps } from '@material-ui/core';
import { Menu, withStyles } from '@material-ui/core';
import { MenuContext } from './MenuContext';

interface Props extends MenuProps {
  onClose: () => void;
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: Props) => {
  const { children, open, onClose, ...otherProps } = props;

  return (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      onClose={onClose}
      {...otherProps}
    >
      <MenuContext.Provider value={{ open, onClose }}>
        {children}
      </MenuContext.Provider>
    </Menu>
  );
});

export default StyledMenu;
