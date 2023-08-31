import { useIcons } from '../../api/icons';
import { findImage } from '../../utils';

interface Props {
  name: string | undefined;
  className?: string;
  alt?: string;
}

function TaskIcon(props: Props) {
  const { className, name, alt } = props;
  const icons = useIcons();

  return <img className={className} src={findImage(name, icons)} alt={alt} />;
}

export default TaskIcon;
