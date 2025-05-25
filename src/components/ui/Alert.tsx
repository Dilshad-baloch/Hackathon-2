import { ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Alert({
  variant = 'info',
  title,
  children,
  className = '',
}: AlertProps) {
  const variants = {
    info: {
      containerClass: 'bg-blue-50 border-blue-200 text-blue-800',
      iconClass: 'text-blue-500',
      Icon: Info,
    },
    success: {
      containerClass: 'bg-green-50 border-green-200 text-green-800',
      iconClass: 'text-green-500',
      Icon: CheckCircle,
    },
    warning: {
      containerClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconClass: 'text-yellow-500',
      Icon: AlertTriangle,
    },
    error: {
      containerClass: 'bg-red-50 border-red-200 text-red-800',
      iconClass: 'text-red-500',
      Icon: XCircle,
    },
  };

  const { containerClass, iconClass, Icon } = variants[variant];

  return (
    <div
      className={`rounded-md border p-4 ${containerClass} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm mt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}