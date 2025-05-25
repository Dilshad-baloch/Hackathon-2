import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="h-16 w-16 text-blue-600" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mt-3 text-lg text-gray-600">
        The page you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary" size="lg">
          Go to Home
        </Button>
      </Link>
    </div>
  );
}