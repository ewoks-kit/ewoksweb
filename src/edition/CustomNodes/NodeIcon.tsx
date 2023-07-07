import { useIcons } from '../../api/icons';
import { findImage } from '../../utils';
import { contentStyle } from './nodeStyles';

interface Props {
  image: string | undefined;
  onDragStart: (e: React.DragEvent<HTMLImageElement>) => void;
}

function NodeIcon(props: Props) {
  const { image, onDragStart } = props;

  const { icons } = useIcons();

  return (
    <img
      style={contentStyle.imgPadding}
      role="presentation"
      draggable="false"
      onDragStart={onDragStart}
      src={findImage(image, icons)}
      alt="icon"
    />
  );
}

export default NodeIcon;
