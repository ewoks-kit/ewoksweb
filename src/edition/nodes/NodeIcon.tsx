import { useIcons } from '../../api/icons';
import { useTasks } from '../../api/tasks';
import useNodeDataStore from '../../store/useNodeDataStore';
import { findImage } from '../../utils';
import { assertNodeDataDefined } from '../../utils/typeGuards';

interface Props {
  nodeId: string;
}

function NodeIcon(props: Props) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  const tasks = useTasks();
  assertNodeDataDefined(nodeData, nodeId);

  const nodeTask = tasks.find(
    (task) => task.task_identifier === nodeData.task_props.task_identifier,
  );
  const taskIcon = nodeTask?.icon;

  const uiProps = nodeData.ui_props;
  const image = uiProps.icon || taskIcon;

  const icons = useIcons();

  return <img draggable="false" src={findImage(image, icons)} alt="" />;
}

export default NodeIcon;
