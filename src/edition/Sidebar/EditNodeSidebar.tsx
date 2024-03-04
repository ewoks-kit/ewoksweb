import type { Node } from 'reactflow';

import NodeDetails from './details/NodeDetails';
import EditNodeStyle from './edit/EditNodeStyle';
import sidebarStyle from './sidebarStyle';
import NodeSidebarMenuItems from './titleMenu/NodeSidebarMenuItems';
import TitleWithMenu from './titleMenu/TitleWithMenu';

interface Props {
  node: Node;
}

function EditNodeSidebar(props: Props) {
  const { node } = props;
  return (
    <>
      <TitleWithMenu
        title="Node"
        renderMenuItems={(onClose) => (
          <NodeSidebarMenuItems node={node} onSelection={onClose} />
        )}
      />
      <NodeDetails {...node} />
      <h3 style={sidebarStyle.sectionHeader}>Appearance</h3>
      <EditNodeStyle nodeId={node.id} />
    </>
  );
}

export default EditNodeSidebar;
