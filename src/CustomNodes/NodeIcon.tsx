import { Fragment } from 'react';
import { useIcons } from '../api/icons';
import type { ExecuteSpinnerProps } from '../Components/Execution/ExecuteSpinner';
import ExecuteSpinner from '../Components/Execution/ExecuteSpinner';
import { findImage } from '../utils';
import { contentStyle } from './NodeStyle';

interface Props {
  image: string | undefined;
  onDragStart: (e: React.DragEvent<HTMLImageElement>) => void;
  hasSpinner?: boolean;
  spinnerProps?: ExecuteSpinnerProps;
}

function NodeIcon(props: Props) {
  const {
    image,
    hasSpinner,
    spinnerProps: spinnerParams = {},
    onDragStart,
  } = props;

  const { icons } = useIcons();

  const Wrapper = hasSpinner ? ExecuteSpinner : Fragment;

  return (
    <Wrapper {...spinnerParams}>
      <img
        style={contentStyle.imgPadding}
        role="presentation"
        draggable="false"
        onDragStart={onDragStart}
        src={findImage(image, icons)}
        alt="icon"
      />
    </Wrapper>
  );
}

export default NodeIcon;
