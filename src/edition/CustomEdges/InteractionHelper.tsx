interface Props {
  path: string;
  interactionWidth?: number;
}

function InteractionHelper(props: Props) {
  const { path, interactionWidth = 20 } = props;

  return (
    <path
      className="react-flow__edge-interaction"
      d={path}
      fill="none"
      strokeOpacity="0"
      strokeWidth={interactionWidth}
    />
  );
}

export default InteractionHelper;
