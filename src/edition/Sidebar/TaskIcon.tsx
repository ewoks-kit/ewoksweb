import { useIcons } from '../../api/icons';
import { findImage } from '../../utils';

interface Props {
  name: string | undefined;
}

function TaskIcon(props: Props) {
  const { name } = props;
  const icons = useIcons();

  return <img src={findImage(name, icons)} alt="" />;
}

export default TaskIcon;
