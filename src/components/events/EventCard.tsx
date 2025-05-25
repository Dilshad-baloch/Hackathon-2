import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Database } from '../../lib/database.types';
import Badge from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event;
  participantCount?: number;
  showStatus?: boolean;
}

export default function EventCard({ 
  event, 
  participantCount, 
  showStatus = false 
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Tech':
        return <Badge variant="primary">{category}</Badge>;
      case 'Education':
        return <Badge variant="secondary">{category}</Badge>;
      case 'Entertainment':
        return <Badge variant="default">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <img
          src={event.image_url || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {getCategoryBadge(event.category)}
          {showStatus && getStatusBadge(event.status)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {event.description}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(event.date_time)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location}
          </div>
          {participantCount !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-2 h-4 w-4" />
              {participantCount} {participantCount === 1 ? 'Participant' : 'Participants'}
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link
            to={`/events/${event.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}