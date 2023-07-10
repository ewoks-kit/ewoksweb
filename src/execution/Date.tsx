import { formatDate } from './utils';

interface Props {
  date: string;
}

function Date(props: Props) {
  const { date } = props;
  return <div>Started on {formatDate(date)}</div>;
}

export default Date;
