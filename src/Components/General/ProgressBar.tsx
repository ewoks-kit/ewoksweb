import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import useStore from '../../store/useStore';

export default function ProgressBar() {
  const gettingFromServer = useStore((state) => state.gettingFromServer);

  if (!gettingFromServer) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}
