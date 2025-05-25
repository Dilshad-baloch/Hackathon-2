import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEventStore } from '../../stores/eventStore';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';
import EventForm from '../../components/events/EventForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { currentEvent, fetchEventById } = useEventStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const event = await fetchEventById(id);
      setIsLoading(false);
      
      // Check if user can edit this event
      if (event && user) {
        const isOwner = event.created_by === user.id;
        const isAdmin = profile?.role === 'admin';
        const isPending = event.status === 'pending';
        
        if (!(isOwner && isPending) && !isAdmin) {
          navigate('/events');
        }
      }
    };
    
    loadEvent();
  }, [id, fetchEventById, user, profile, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!currentEvent) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
        <p className="mt-2 text-gray-600">
          The event you're trying to edit doesn't exist or you don't have permission to edit it.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/events')}
          className="mt-4"
        >
          Back to Events
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link to={`/events/${id}`}>
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        
        <CardContent>
          <EventForm event={currentEvent} isEditing />
        </CardContent>
      </Card>
    </div>
  );
}