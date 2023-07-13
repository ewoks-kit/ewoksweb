import { useIcons } from '../../api/icons';
import useNodeDataStore from '../../store/useNodeDataStore';
import useStore from '../../store/useStore';
import { findImage } from '../../utils';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import { contentStyle } from './nodeStyles';

interface Props {
  nodeId: string;
  onDragStart: (e: React.DragEvent<HTMLImageElement>) => void;
}

function NodeIcon(props: Props) {
  const { nodeId, onDragStart } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  const tasks = useStore((state) => state.tasks);
  assertNodeDataDefined(nodeData, nodeId);

  const nodeTask = tasks.find(
    (task) => task.task_identifier === nodeData.task_props.task_identifier
  );
  const taskIcon = nodeTask?.icon;

  const uiProps = nodeData.ui_props;
  const image = uiProps.icon || uiProps.node_icon || taskIcon;

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
