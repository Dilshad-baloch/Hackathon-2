import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { useEventStore } from '../../stores/eventStore';
import { useParticipantStore } from '../../stores/participantStore';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import ParticipantList from '../../components/participants/ParticipantList';
import ParticipantForm from '../../components/participants/ParticipantForm';
import Spinner from '../../components/ui/Spinner';

export default function Participants() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEvent, fetchEventById } = useEventStore();
  const { participants, fetchParticipantsByEventId } = useParticipantStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      await fetchEventById(id);
      await fetchParticipantsByEventId(id);
      setIsLoading(false);
    };
    
    loadData();
  }, [id, fetchEventById, fetchParticipantsByEventId]);
  
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
          The event you're looking for doesn't exist or you don't have permission to view it.
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
        
        <h1 className="text-2xl font-bold text-gray-900">
          Participants - {currentEvent.title}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <ParticipantList
                participants={participants}
                event={currentEvent}
              />
            </CardContent>
          </Card>
        </div>
        
        {currentEvent.status === 'approved' && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add Participant</CardTitle>
              </CardHeader>
              
              <CardContent>
                <ParticipantForm
                  eventId={currentEvent.id}
                  onSuccess={() => fetchParticipantsByEventId(currentEvent.id)}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}