import type { StandardTextFieldProps } from '@mui/material';
import { TextField, Tooltip } from '@mui/material';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { forwardRef, Fragment } from 'react';

interface Props extends StandardTextFieldProps {
  tooltip?: string;
}

const FormField = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { tooltip, ...textFieldProps } = props;

  const Wrapper = useMemo(
    () =>
      tooltip
        ? ({ children }: { children: ReactElement }) => (
            <Tooltip arrow title={tooltip}>
              {children}
            </Tooltip>
          )
        : Fragment,
    [tooltip],
  );

  return (
    <Wrapper>
      <TextField
        ref={ref}
        margin="dense"
        fullWidth
        variant="standard"
        {...textFieldProps}
        slotProps={{
          ...textFieldProps.slotProps,
          htmlInput: textFieldProps.label
            ? { 'aria-label': textFieldProps.label as string }
            : {},
        }}
      />
    </Wrapper>
  );
});

export default FormField;
