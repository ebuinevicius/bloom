import { ArrowPathIcon } from '@heroicons/react/20/solid';

type LoadingSpinnerProps = {
  small?: boolean;
  big?: boolean;
};

export function LoadingSpinner({ big = false, small = false }: LoadingSpinnerProps) {
  const sizeClasses = big ? 'w-16 h-16' : small ? 'w-6 h-6' : 'w-10 h-10';

  return <ArrowPathIcon className={`animate-spin ${sizeClasses}`} />;
}
