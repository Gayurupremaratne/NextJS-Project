import { Spinner } from '../components/atomic/Spinner';

export default function Loading() {
  return (
    <Spinner
      className="h-screen flex items-center justify-center"
      loading={true}
      spinnerSize={'lg'}
    />
  );
}
