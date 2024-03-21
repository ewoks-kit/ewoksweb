import GraphDetails from './details/GraphDetails';
import EditGraphStyle from './edit/EditGraphStyle';
import TitleWithMenu from './titleMenu/TitleWithMenu';

function EditWorkflowSidebar() {
  return (
    <>
      <TitleWithMenu title="Workflow" />
      <GraphDetails />
      <EditGraphStyle />
    </>
  );
}

export default EditWorkflowSidebar;
