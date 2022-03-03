export default function isValidLink(connection, graphRF) {
  console.log(connection, graphRF);
  let isValid = true;
  // from source and target see
  const source = graphRF.nodes.find((nod) => nod.id === connection.source);
  const target = graphRF.nodes.find((nod) => nod.id === connection.target);
  console.log(source, target);
  // if it is Input-Output
  if (['graphOutput', 'graphInput'].includes(source.task_type)) {
    // calc if other connections exist and allow connection
    console.log('Source is inout');
    const existingConnections = graphRF.links.filter(
      (link) => link.source === source.id
    );
    console.log(existingConnections);
    if (existingConnections.length > 1) {
      console.log('already wrong');
      isValid = false;
    } else if (existingConnections.length === 1) {
      console.log('cannot add another');
      isValid = false;
    }
  }

  if (['graphOutput', 'graphInput'].includes(target.task_type)) {
    // calc if other connections exist and allow connection
    console.log('target is inout');
    const existingConnections = graphRF.links.filter(
      (link) => link.target === target.id
    );
    console.log(existingConnections);
    if (existingConnections.length > 1) {
      console.log('already wrong');
      isValid = false;
    } else if (existingConnections.length === 1) {
      console.log('cannot add another');
      isValid = false;
    }
  }

  return isValid;
}
