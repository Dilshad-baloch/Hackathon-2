import { ReactNode } from 'react';
import { Calendar, Users, FileQuestion } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  type?: 'events' | 'participants' | 'generic';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  type = 'generic',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  const icons: Record<string, ReactNode> = {
    events: <Calendar className="h-12 w-12 text-gray-400" />,
    participants: <Users className="h-12 w-12 text-gray-400" />,
    generic: <FileQuestion className="h-12 w-12 text-gray-400" />,
  };

  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center ${className}`}>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        {icons[type]}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <Button
          variant="primary"
          size="md"
          onClick={action.onClick}
          className="mt-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}