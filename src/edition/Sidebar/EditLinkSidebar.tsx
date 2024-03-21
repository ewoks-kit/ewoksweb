import type { Edge } from 'reactflow';

import LinkDetails from './details/LinkDetails';
import EditLinkStyle from './edit/EditLinkStyle';
import sidebarStyle from './sidebarStyle';
import LinkSidebarMenuItems from './titleMenu/LinkSidebarMenuItems';
import TitleWithMenu from './titleMenu/TitleWithMenu';

interface Props {
  link: Edge;
}

function EditLinkSidebar(props: Props) {
  const { link } = props;

  return (
    <>
      <TitleWithMenu
        title="Link"
        renderMenuItems={(onClose) => (
          <LinkSidebarMenuItems link={link} onSelection={onClose} />
        )}
      />
      <LinkDetails key={link.id} {...link} />
      <h3 style={sidebarStyle.sectionHeader}>Appearance</h3>
      <EditLinkStyle key={link.id} {...link} />
    </>
  );
}

export default EditLinkSidebar;
