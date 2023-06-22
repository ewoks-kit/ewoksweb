import type { StandardTextFieldProps } from '@material-ui/core';
import { TextField, Tooltip } from '@material-ui/core';
import type { ReactElement } from 'react';
import { forwardRef, Fragment } from 'react';

interface Props extends StandardTextFieldProps {
  tooltip?: string;
}

const FormField = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { tooltip, ...textFieldProps } = props;

  const Wrapper = tooltip
    ? ({ children }: { children: ReactElement }) => (
        <Tooltip arrow title={tooltip}>
          {children}
        </Tooltip>
      )
    : Fragment;

  return (
    <Wrapper>
      <TextField
        ref={ref}
        margin="dense"
        fullWidth
        variant="standard"
        inputProps={
          textFieldProps.label
            ? { 'aria-label': textFieldProps.label as string }
            : {}
        }
        {...textFieldProps}
      />
    </Wrapper>
  );
});

export default FormField;
