import state from '../store/state';
import type { EwoksRFLink, EwoksRFNode, GraphDetails, GraphRF } from '../types';

// TODO not applicable to change several things with set. keep it as example
// to examine how custom hooks can be used to share functionallity
function useDeleteElement(element, graphRF) {
  // const graphRF = state((state) => state.graphRF);
  const setGraphRF = state((state) => state.setGraphRF);
  const workingGraph = state((state) => state.workingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const setUndoRedo = state((state) => state.setUndoRedo);

  let newGraph = {} as GraphRF;
  const elN = element as EwoksRFNode;
  const elL = element as EwoksRFLink;
  const elD = element as GraphDetails;
  if (elN.position) {
    const nodesLinks = graphRF.links.filter(
      (link) => !(link.source === elN.id || link.target === elN.id)
    );

    newGraph = {
      ...graphRF,
      nodes: graphRF.nodes.filter((nod) => nod.id !== element.id),
      links: nodesLinks,
    };
    setUndoRedo({
      action: 'Removed a Node',
      graph: newGraph,
    });
  } else if (elL.source) {
    newGraph = {
      ...graphRF,
      links: graphRF.links.filter((link) => link.id !== elL.id),
    };
    setUndoRedo({
      action: 'Removed a Link',
      graph: newGraph,
    });
  }

  if (elD.input_nodes && elD.id !== 'newGraph') {
    // setOpenAgreeDialog(true);
  } else if (!elD.input_nodes) {
    if (workingGraph.graph.id === graphRF.graph.id) {
      setGraphRF(newGraph);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to delete any element in a sub-graph!',
        severity: 'success',
      });
    }
  } else {
    setOpenSnackbar({
      open: true,
      text: 'Nothing to delete!',
      severity: 'error',
    });
  }
  return !!element.id;
}

export default useDeleteElement;
