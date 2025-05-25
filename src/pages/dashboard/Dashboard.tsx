import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useEventStore } from '../../stores/eventStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EventList from '../../components/events/EventList';
import Spinner from '../../components/ui/Spinner';

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const { events, myEvents, fetchEvents, fetchMyEvents } = useEventStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchEvents(), fetchMyEvents()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchEvents, fetchMyEvents]);
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const pendingEvents = myEvents.filter(event => event.status === 'pending');
  const approvedEvents = myEvents.filter(event => event.status === 'approved');
  const rejectedEvents = myEvents.filter(event => event.status === 'rejected');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {profile?.full_name || user?.email}
        </h1>
        <p className="mt-1 text-gray-600">
          Manage your events and participants from your dashboard
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-center text-xl">
              {myEvents.length}
            </CardTitle>
            <p className="text-center text-sm text-gray-500">Total Events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-center text-xl">
              {pendingEvents.length}
            </CardTitle>
            <p className="text-center text-sm text-gray-500">Pending Events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-center text-xl">
              {approvedEvents.length}
            </CardTitle>
            <p className="text-center text-sm text-gray-500">Approved Events</p>
          </CardContent>
        </Card>
        
        <Card className="flex items-center justify-center p-6">
          <Link to="/events/create">
            <Button variant="primary" className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Event
            </Button>
          </Link>
        </Card>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Events</h2>
          <Link to="/events">
            <Button variant="outline" size="sm">
              View All Events
            </Button>
          </Link>
        </div>
        
        <EventList 
          events={myEvents.slice(0, 6)} 
          showStatus={true}
          emptyStateTitle="No events created yet"
          emptyStateDescription="You haven't created any events yet. Create your first event to get started."
        />
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        
        <EventList 
          events={events.filter(event => new Date(event.date_time) > new Date()).slice(0, 3)}
          emptyStateTitle="No upcoming events"
          emptyStateDescription="There are no upcoming events at the moment."
        />
      </div>
    </div>
  );
}