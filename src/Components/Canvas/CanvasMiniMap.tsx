import { MiniMap } from 'reactflow';

function CanvasMiniMap() {
  return (
    <MiniMap
      nodeStrokeColor={(n) => {
        if (n.style?.background) {
          return n.style.background.toString();
        }
        if (n.type === 'graphOutput' || n.type === 'graphInput') {
          return '#0041d0';
        }
        if (n.type === 'graph') {
          return '#ff0072';
        }
        return 'rgb(60, 81, 202)';
      }}
      nodeColor={(n): string => {
        if (n.style?.background) {
          return n.style.background.toString();
        }
        if (n.type === 'graphOutput' || n.type === 'graphInput') {
          return 'rgb(223, 226, 247)';
        }
        if (n.type === 'graph') {
          return 'rgba(244, 179, 131, 0.87)';
        }

        return 'rgb(60, 81, 202)';
      }}
      nodeBorderRadius={2}
    />
  );
}

export default CanvasMiniMap;
