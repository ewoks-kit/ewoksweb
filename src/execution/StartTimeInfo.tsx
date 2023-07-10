import ReactTimeago from 'react-timeago';
import { formatDate } from './utils';

interface Props {
  time: string;
}

const ONE_DAY_IN_MS = 24 * 3600 * 1000;

function StartDateInfo(props: Props) {
  const { time } = props;

  const startDate = new Date(time);
  const now = new Date(Date.now());

  if (now.valueOf() - startDate.valueOf() < ONE_DAY_IN_MS) {
    return <ReactTimeago date={startDate.toString()} />;
  }

  return <div>Started on {formatDate(time)}</div>;
}

export default StartDateInfo;
