import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Tag, 
  Edit, 
  Trash2, 
  Users, 
  ArrowLeft 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useEventStore } from '../../stores/eventStore';
import { useParticipantStore } from '../../stores/participantStore';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import ParticipantForm from '../../components/participants/ParticipantForm';
import ParticipantList from '../../components/participants/ParticipantList';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { currentEvent, fetchEventById, deleteEvent } = useEventStore();
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
  
  const handleDelete = async () => {
    if (!currentEvent) return;
    
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const { error } = await deleteEvent(currentEvent.id);
      
      if (error) {
        toast.error('Failed to delete event');
        return;
      }
      
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
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
  
  const isOwner = currentEvent && user && currentEvent.created_by === user.id;
  const isAdmin = profile?.role === 'admin';
  const canEdit = isOwner && currentEvent?.status === 'pending';
  const canDelete = isOwner || isAdmin;
  const canAddParticipants = currentEvent?.status === 'approved' && (isOwner || isAdmin);
  
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
              <img
                src={currentEvent.image_url || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                alt={currentEvent.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4">
                {getStatusBadge(currentEvent.status)}
              </div>
            </div>
            
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900">{currentEvent.title}</h2>
              
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                  <span>{formatDate(currentEvent.date_time)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                  <span>{currentEvent.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Tag className="mr-2 h-5 w-5 text-gray-500" />
                  <span>{currentEvent.category}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <span>Created {new Date(currentEvent.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <p className="mt-2 whitespace-pre-line text-gray-600">{currentEvent.description}</p>
              </div>
              
              {(canEdit || canDelete) && (
                <div className="mt-6 flex space-x-4">
                  {canEdit && (
                    <Link to={`/events/edit/${currentEvent.id}`}>
                      <Button variant="primary" className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Event
                      </Button>
                    </Link>
                  )}
                  
                  {canDelete && (
                    <Button
                      variant="danger"
                      onClick={handleDelete}
                      className="flex items-center"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {currentEvent.status === 'approved' && (
            <Card className="mt-8">
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
          )}
        </div>
        
        <div>
          {canAddParticipants && (
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
          )}
        </div>
      </div>
    </div>
  );
}