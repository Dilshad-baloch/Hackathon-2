import { useState } from 'react';
import { Database } from '../../lib/database.types';
import EventCard from './EventCard';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';
import { useNavigate } from 'react-router-dom';

type Event = Database['public']['Tables']['events']['Row'];

interface EventListProps {
  events: Event[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  showStatus?: boolean;
  participantCounts?: Record<string, number>;
}

export default function EventList({
  events,
  emptyStateTitle = 'No events found',
  emptyStateDescription = 'There are no events to display at the moment.',
  showStatus = false,
  participantCounts,
}: EventListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;
  
  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);
  
  if (events.length === 0) {
    return (
      <EmptyState
        type="events"
        title={emptyStateTitle}
        description={emptyStateDescription}
        action={{
          label: 'Create Event',
          onClick: () => navigate('/events/create'),
        }}
        className="my-8"
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            showStatus={showStatus}
            participantCount={participantCounts?.[event.id]}
          />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}