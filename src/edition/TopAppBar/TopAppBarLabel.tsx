import useStore from '../../store/useStore';
import SubgraphStack from './SubgraphStack';

export default function TopAppBarLabel() {
  const subgraphsStack = useStore((state) => {
    return state.subgraphsStack;
  });

  if (subgraphsStack.length === 0 || !subgraphsStack[0].label) {
    return (
      <span data-cy="untitled_workflow">
        untitled_workflow{' '}
        <span
          style={{
            fontWeight: 'lighter',
            fontStyle: 'italic',
            fontSize: '1rem',
          }}
        >
          (unsaved)
        </span>
      </span>
    );
  }

  if (subgraphsStack.length > 1) {
    return <SubgraphStack />;
  }

  return (
    <span data-cy={subgraphsStack[0].label}>{subgraphsStack[0].label}</span>
  );
}
